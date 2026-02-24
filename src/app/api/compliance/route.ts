import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/compliance - Get compliance summary
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // epf, esi, pt, lwf
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    // Get organization
    const organization = await db.organization.findFirst();
    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 400 }
      );
    }

    // Get salary records for the period
    const salaryRecords = await db.salaryRecord.findMany({
      where: {
        month,
        year,
        status: { not: 'draft' }
      },
      include: {
        employee: {
          select: {
            id: true,
            employeeCode: true,
            firstName: true,
            lastName: true,
            uanNumber: true,
            esiNumber: true,
          }
        }
      }
    });

    // Calculate EPF summary
    const epfSummary = {
      totalWages: salaryRecords.reduce((acc, r) => acc + r.basicSalary + r.dearnessAllowance, 0),
      employeeContribution: salaryRecords.reduce((acc, r) => acc + r.pfEmployee, 0),
      employerContribution: salaryRecords.reduce((acc, r) => acc + r.pfEmployer, 0),
      totalEmployees: salaryRecords.filter(r => r.pfEmployee > 0).length,
      dueDate: new Date(year, month, 15), // 15th of next month
    };

    // Calculate ESI summary
    const esiSummary = {
      totalWages: salaryRecords.reduce((acc, r) => acc + r.basicSalary + r.dearnessAllowance + r.houseRentAllowance, 0),
      employeeContribution: salaryRecords.reduce((acc, r) => acc + r.esiEmployee, 0),
      employerContribution: salaryRecords.reduce((acc, r) => acc + r.esiEmployer, 0),
      totalEmployees: salaryRecords.filter(r => r.esiEmployee > 0).length,
      dueDate: new Date(year, month, 15),
    };

    // Calculate PT summary
    const ptSummary = {
      totalAmount: salaryRecords.reduce((acc, r) => acc + r.professionalTax, 0),
      totalEmployees: salaryRecords.filter(r => r.professionalTax > 0).length,
      dueDate: new Date(year, month, 21), // 21st of next month
    };

    // Get existing compliance records
    const pfRecords = await db.pFRecord.findMany({
      where: { month, year }
    });

    const esiRecords = await db.eSIRecord.findMany({
      where: { month, year }
    });

    const complianceItems = [
      {
        type: 'EPF',
        month: `${getMonthName(month)} ${year}`,
        dueDate: formatDate(new Date(year, month, 15)),
        employeeContribution: epfSummary.employeeContribution,
        employerContribution: epfSummary.employerContribution,
        total: epfSummary.employeeContribution + epfSummary.employerContribution,
        status: pfRecords.length > 0 && pfRecords[0].returnFiled ? 'paid' : 'pending',
      },
      {
        type: 'ESI',
        month: `${getMonthName(month)} ${year}`,
        dueDate: formatDate(new Date(year, month, 15)),
        employeeContribution: esiSummary.employeeContribution,
        employerContribution: esiSummary.employerContribution,
        total: esiSummary.employeeContribution + esiSummary.employerContribution,
        status: esiRecords.length > 0 && esiRecords[0].returnFiled ? 'paid' : 'pending',
      },
      {
        type: 'PT',
        month: `${getMonthName(month)} ${year}`,
        dueDate: formatDate(new Date(year, month, 21)),
        total: ptSummary.totalAmount,
        status: 'pending',
      },
    ];

    return NextResponse.json({
      complianceItems,
      summaries: {
        epf: epfSummary,
        esi: esiSummary,
        pt: ptSummary,
      },
      organization: {
        name: organization.name,
        pfEstablishmentCode: organization.pfEstablishmentCode,
        esiEstablishmentCode: organization.esiEstablishmentCode,
      }
    });
  } catch (error) {
    console.error('Error fetching compliance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance data' },
      { status: 500 }
    );
  }
}

// POST /api/compliance - File compliance return
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, month, year, challanNumber, challanDate } = body;

    if (type === 'epf') {
      // Get salary records
      const salaryRecords = await db.salaryRecord.findMany({
        where: { month, year }
      });

      // Create/update PF records
      for (const record of salaryRecords) {
        if (record.pfEmployee > 0) {
          const epfWages = record.basicSalary + record.dearnessAllowance;
          
          await db.pFRecord.upsert({
            where: {
              employeeId_month_year: {
                employeeId: record.employeeId,
                month,
                year
              }
            },
            create: {
              employeeId: record.employeeId,
              month,
              year,
              wages: Math.min(epfWages, 15000),
              epsWages: Math.min(epfWages, 15000),
              edliWages: Math.min(epfWages, 15000),
              epfContribution: record.pfEmployee,
              epsContribution: Math.round(Math.min(epfWages, 15000) * 8.33 / 100),
              epfDiffContribution: record.pfEmployer,
              ncpDays: record.unpaidDays,
              returnFiled: true,
              returnFiledAt: new Date(),
              challanNumber,
              challanDate: challanDate ? new Date(challanDate) : new Date(),
            },
            update: {
              returnFiled: true,
              returnFiledAt: new Date(),
              challanNumber,
              challanDate: challanDate ? new Date(challanDate) : new Date(),
            }
          });
        }
      }
    } else if (type === 'esi') {
      // Get salary records
      const salaryRecords = await db.salaryRecord.findMany({
        where: { month, year }
      });

      // Create/update ESI records
      for (const record of salaryRecords) {
        if (record.esiEmployee > 0) {
          const esiWages = record.grossEarnings;
          
          await db.eSIRecord.upsert({
            where: {
              employeeId_month_year: {
                employeeId: record.employeeId,
                month,
                year
              }
            },
            create: {
              employeeId: record.employeeId,
              month,
              year,
              wages: Math.min(esiWages, 21000),
              employeeContribution: record.esiEmployee,
              employerContribution: record.esiEmployer,
              totalContribution: record.esiEmployee + record.esiEmployer,
              returnFiled: true,
              returnFiledAt: new Date(),
              challanNumber,
              challanDate: challanDate ? new Date(challanDate) : new Date(),
            },
            update: {
              returnFiled: true,
              returnFiledAt: new Date(),
              challanNumber,
              challanDate: challanDate ? new Date(challanDate) : new Date(),
            }
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${type.toUpperCase()} return filed successfully`
    });
  } catch (error) {
    console.error('Error filing compliance:', error);
    return NextResponse.json(
      { error: 'Failed to file compliance return' },
      { status: 500 }
    );
  }
}

function getMonthName(month: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1] || '';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
