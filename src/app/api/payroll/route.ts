import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  calculatePayroll, 
  calculateOvertime,
  getWorkingDaysInMonth,
  PayrollInput 
} from '@/lib/indian-payroll';

// GET /api/payroll - Get payroll records
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get('month') || new Date().getMonth().toString());
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const employeeId = searchParams.get('employeeId');

    const where: any = {
      month: month + 1, // Convert 0-indexed to 1-indexed
      year,
    };

    if (employeeId) {
      where.employeeId = employeeId;
    }

    const salaryRecords = await db.salaryRecord.findMany({
      where,
      include: {
        employee: {
          select: {
            employeeCode: true,
            firstName: true,
            lastName: true,
            designation: true,
            department: true,
          }
        }
      },
      orderBy: { employee: { employeeCode: 'asc' } }
    });

    // Calculate summary
    const summary = {
      totalEmployees: salaryRecords.length,
      processedEmployees: salaryRecords.filter(r => r.status !== 'draft').length,
      totalGross: salaryRecords.reduce((acc, r) => acc + r.grossEarnings, 0),
      totalDeductions: salaryRecords.reduce((acc, r) => acc + r.totalDeductions, 0),
      totalNetPay: salaryRecords.reduce((acc, r) => acc + r.netPay, 0),
      totalEmployerCost: salaryRecords.reduce((acc, r) => acc + r.employerCost, 0),
      totalPFEmployee: salaryRecords.reduce((acc, r) => acc + r.pfEmployee, 0),
      totalPFEmployer: salaryRecords.reduce((acc, r) => acc + r.pfEmployer, 0),
      totalESIEmployee: salaryRecords.reduce((acc, r) => acc + r.esiEmployee, 0),
      totalESIEmployer: salaryRecords.reduce((acc, r) => acc + r.esiEmployer, 0),
      totalPT: salaryRecords.reduce((acc, r) => acc + r.professionalTax, 0),
    };

    return NextResponse.json({
      salaryRecords,
      summary,
      month: month + 1,
      year,
    });
  } catch (error) {
    console.error('Error fetching payroll:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payroll records' },
      { status: 500 }
    );
  }
}

// POST /api/payroll - Process payroll
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { month, year, employeeIds } = body;

    // Get organization with compliance settings
    const organization = await db.organization.findFirst({
      include: {
        complianceSettings: true,
      }
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 400 }
      );
    }

    // Get employees to process
    const whereClause: any = { status: 'active' };
    if (employeeIds && employeeIds.length > 0) {
      whereClause.id = { in: employeeIds };
    }

    const employees = await db.employee.findMany({
      where: whereClause,
      include: {
        salaryStructure: true,
        attendance: {
          where: {
            date: {
              gte: new Date(year, month, 1),
              lt: new Date(year, month + 1, 1),
            }
          }
        }
      }
    });

    const compliance = organization.complianceSettings[0];
    const workingDaysInMonth = getWorkingDaysInMonth(month + 1, year);
    const processedRecords = [];

    for (const employee of employees) {
      if (!employee.salaryStructure) continue;

      // Calculate paid days from attendance
      const presentDays = employee.attendance.filter(a => 
        a.status === 'present' || a.status === 'half-day'
      ).length;
      const halfDays = employee.attendance.filter(a => a.status === 'half-day').length;
      const paidDays = presentDays - (halfDays * 0.5);
      const overtimeHours = employee.attendance.reduce((acc, a) => acc + a.overtimeHours, 0);

      // Prepare payroll input
      const payrollInput: PayrollInput = {
        basicSalary: employee.salaryStructure.basicSalary,
        dearnessAllowance: employee.salaryStructure.dearnessAllowance,
        houseRentAllowance: employee.salaryStructure.houseRentAllowance,
        conveyanceAllowance: employee.salaryStructure.conveyanceAllowance,
        medicalAllowance: employee.salaryStructure.medicalAllowance,
        specialAllowance: employee.salaryStructure.specialAllowance,
        otherAllowances: employee.salaryStructure.otherAllowances,
        overtimeAmount: calculateOvertime(
          employee.salaryStructure.basicSalary,
          employee.salaryStructure.dearnessAllowance,
          overtimeHours,
          employee.workingHours
        ),
        paidDays: Math.round(paidDays),
        totalWorkingDays: workingDaysInMonth,
        overtimeHours,
        pfApplicable: employee.salaryStructure.pfApplicable && !!employee.uanNumber,
        esiApplicable: employee.salaryStructure.esiApplicable,
        ptApplicable: employee.salaryStructure.ptApplicable,
        lwfApplicable: compliance?.lwfApplicable || false,
        state: compliance?.state,
      };

      // Calculate payroll
      const payrollOutput = calculatePayroll(payrollInput);

      // Create or update salary record
      const salaryRecord = await db.salaryRecord.upsert({
        where: {
          employeeId_month_year: {
            employeeId: employee.id,
            month: month + 1,
            year,
          }
        },
        create: {
          employeeId: employee.id,
          month: month + 1,
          year,
          totalWorkingDays: workingDaysInMonth,
          paidDays: Math.round(paidDays),
          unpaidDays: workingDaysInMonth - Math.round(paidDays),
          overtimeHours,
          basicSalary: Math.round(payrollInput.basicSalary * paidDays / workingDaysInMonth),
          dearnessAllowance: Math.round(payrollInput.dearnessAllowance * paidDays / workingDaysInMonth),
          houseRentAllowance: Math.round(payrollInput.houseRentAllowance * paidDays / workingDaysInMonth),
          conveyanceAllowance: Math.round(payrollInput.conveyanceAllowance * paidDays / workingDaysInMonth),
          medicalAllowance: Math.round(payrollInput.medicalAllowance * paidDays / workingDaysInMonth),
          specialAllowance: Math.round(payrollInput.specialAllowance * paidDays / workingDaysInMonth),
          overtimeAmount: payrollOutput.grossEarnings - Math.round(
            (payrollInput.basicSalary + payrollInput.dearnessAllowance + 
             payrollInput.houseRentAllowance + payrollInput.conveyanceAllowance +
             payrollInput.medicalAllowance + payrollInput.specialAllowance + payrollInput.otherAllowances) * paidDays / workingDaysInMonth
          ),
          otherAllowances: Math.round(payrollInput.otherAllowances * paidDays / workingDaysInMonth),
          grossEarnings: payrollOutput.grossEarnings,
          pfEmployee: payrollOutput.pfEmployee,
          pfEmployer: payrollOutput.pfEmployer,
          esiEmployee: payrollOutput.esiEmployee,
          esiEmployer: payrollOutput.esiEmployer,
          professionalTax: payrollOutput.professionalTax,
          lwfEmployee: payrollOutput.lwfEmployee,
          lwfEmployer: payrollOutput.lwfEmployer,
          tds: 0,
          otherDeductions: 0,
          totalDeductions: payrollOutput.totalDeductions,
          netPay: payrollOutput.netPay,
          employerCost: payrollOutput.employerCost,
          status: 'processed',
          processedAt: new Date(),
        },
        update: {
          paidDays: Math.round(paidDays),
          unpaidDays: workingDaysInMonth - Math.round(paidDays),
          overtimeHours,
          grossEarnings: payrollOutput.grossEarnings,
          pfEmployee: payrollOutput.pfEmployee,
          pfEmployer: payrollOutput.pfEmployer,
          esiEmployee: payrollOutput.esiEmployee,
          esiEmployer: payrollOutput.esiEmployer,
          professionalTax: payrollOutput.professionalTax,
          totalDeductions: payrollOutput.totalDeductions,
          netPay: payrollOutput.netPay,
          employerCost: payrollOutput.employerCost,
          status: 'processed',
          processedAt: new Date(),
        }
      });

      processedRecords.push(salaryRecord);
    }

    return NextResponse.json({
      success: true,
      processedCount: processedRecords.length,
      message: `Payroll processed for ${processedRecords.length} employees`
    });
  } catch (error) {
    console.error('Error processing payroll:', error);
    return NextResponse.json(
      { error: 'Failed to process payroll' },
      { status: 500 }
    );
  }
}
