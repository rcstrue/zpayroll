import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/employees - List all employees
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { employeeCode: { contains: search, mode: 'insensitive' } },
        { designation: { contains: search, mode: 'insensitive' } },
      ];
    }

    const employees = await db.employee.findMany({
      where,
      include: {
        salaryStructure: {
          select: {
            structureName: true,
            basicSalary: true,
          }
        },
        deployments: {
          where: { isActive: true },
          include: {
            client: {
              select: {
                companyName: true,
                clientCode: true,
              }
            }
          },
          take: 1,
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await db.employee.count({ where });

    return NextResponse.json({
      employees,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST /api/employees - Create new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get organization
    const organization = await db.organization.findFirst();
    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found. Please complete setup first.' },
        { status: 400 }
      );
    }

    // Generate employee code
    const lastEmployee = await db.employee.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    const sequence = lastEmployee 
      ? parseInt(lastEmployee.employeeCode.replace(/\D/g, '')) + 1 
      : 1;
    const employeeCode = `EMP${String(sequence).padStart(5, '0')}`;

    // Create employee
    const employee = await db.employee.create({
      data: {
        organizationId: organization.id,
        employeeCode,
        firstName: body.firstName,
        lastName: body.lastName,
        fatherName: body.fatherName,
        motherName: body.motherName,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender,
        maritalStatus: body.maritalStatus,
        bloodGroup: body.bloodGroup,
        phone: body.phone,
        alternatePhone: body.alternatePhone,
        email: body.email,
        permanentAddress: body.permanentAddress,
        permanentCity: body.permanentCity,
        permanentState: body.permanentState,
        permanentPincode: body.permanentPincode,
        currentAddress: body.currentAddress || body.permanentAddress,
        currentCity: body.currentCity || body.permanentCity,
        currentState: body.currentState || body.permanentState,
        currentPincode: body.currentPincode || body.permanentPincode,
        aadhaarNumber: body.aadhaarNumber,
        panNumber: body.panNumber,
        voterId: body.voterId,
        drivingLicense: body.drivingLicense,
        passportNumber: body.passportNumber,
        bankName: body.bankName,
        bankAccountNo: body.bankAccountNo,
        bankIfsc: body.bankIfsc,
        bankBranch: body.bankBranch,
        uanNumber: body.uanNumber,
        pfNumber: body.pfNumber,
        esiNumber: body.esiNumber,
        dateOfJoining: body.dateOfJoining ? new Date(body.dateOfJoining) : null,
        designation: body.designation,
        department: body.department,
        employmentType: body.employmentType || 'contract',
        status: body.status || 'active',
        salaryStructureId: body.salaryStructureId,
        workingDays: body.workingDays || 26,
        workingHours: body.workingHours || 8.0,
      }
    });

    // Create leave balances for current year
    const currentYear = new Date().getFullYear();
    const leaveTypes = await db.leaveType.findMany({
      where: { organizationId: organization.id }
    });

    for (const lt of leaveTypes) {
      await db.leaveBalance.create({
        data: {
          employeeId: employee.id,
          leaveTypeId: lt.id,
          year: currentYear,
          openingBalance: 0,
          accrued: lt.annualQuota,
          used: 0,
          closingBalance: lt.annualQuota,
        }
      });
    }

    return NextResponse.json({
      success: true,
      employee,
      message: 'Employee created successfully'
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
