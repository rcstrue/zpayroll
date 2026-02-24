import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/setup - Check if setup is complete
export async function GET() {
  try {
    const orgCount = await db.organization.count();
    
    return NextResponse.json({
      isSetupComplete: orgCount > 0,
      message: orgCount > 0 ? 'Setup already complete' : 'Setup required'
    });
  } catch (error) {
    console.error('Error checking setup:', error);
    return NextResponse.json(
      { error: 'Failed to check setup status' },
      { status: 500 }
    );
  }
}

// POST /api/setup - Initialize organization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if already setup
    const existingOrg = await db.organization.findFirst();
    if (existingOrg) {
      return NextResponse.json(
        { error: 'Organization already exists' },
        { status: 400 }
      );
    }

    // Create organization
    const organization = await db.organization.create({
      data: {
        name: body.name,
        gstin: body.gstin,
        pan: body.pan,
        cin: body.cin,
        registrationNumber: body.registrationNumber,
        pfEstablishmentCode: body.pfEstablishmentCode,
        esiEstablishmentCode: body.esiEstablishmentCode,
        address: body.address,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        phone: body.phone,
        email: body.email,
        website: body.website,
        bankName: body.bankName,
        bankAccountNo: body.bankAccountNo,
        bankIfsc: body.bankIfsc,
        bankBranch: body.bankBranch,
        pfContributionRate: body.pfContributionRate || 12.0,
        esiContributionRate: body.esiContributionRate || 3.25,
      }
    });

    // Create default attendance settings
    await db.attendanceSetting.create({
      data: {
        organizationId: organization.id,
        shiftStartTime: '09:00',
        shiftEndTime: '18:00',
        graceMinutes: 15,
        halfDayHours: 4.0,
        overtimeThreshold: 9.0,
        weekdaysOnly: true,
      }
    });

    // Create default leave types
    const leaveTypes = [
      { leaveTypeName: 'Casual Leave', leaveCode: 'CL', annualQuota: 12, isPaid: true },
      { leaveTypeName: 'Sick Leave', leaveCode: 'SL', annualQuota: 12, isPaid: true },
      { leaveTypeName: 'Earned Leave', leaveCode: 'EL', annualQuota: 21, isPaid: true, carryForward: true, maxCarryForward: 10 },
      { leaveTypeName: 'National Holiday', leaveCode: 'NH', annualQuota: 3, isPaid: true },
    ];

    for (const lt of leaveTypes) {
      await db.leaveType.create({
        data: {
          organizationId: organization.id,
          ...lt
        }
      });
    }

    // Create default salary structures
    const salaryStructures = [
      {
        structureName: 'Unskilled Worker',
        basicSalary: 9000,
        dearnessAllowance: 1000,
        houseRentAllowance: 1500,
        conveyanceAllowance: 500,
        specialAllowance: 500,
        pfApplicable: true,
        esiApplicable: true,
        ptApplicable: true,
      },
      {
        structureName: 'Semi-Skilled Worker',
        basicSalary: 11000,
        dearnessAllowance: 1500,
        houseRentAllowance: 2000,
        conveyanceAllowance: 500,
        specialAllowance: 1000,
        pfApplicable: true,
        esiApplicable: true,
        ptApplicable: true,
      },
      {
        structureName: 'Skilled Worker',
        basicSalary: 14000,
        dearnessAllowance: 2000,
        houseRentAllowance: 3000,
        conveyanceAllowance: 1000,
        specialAllowance: 1500,
        pfApplicable: true,
        esiApplicable: true,
        ptApplicable: true,
      },
      {
        structureName: 'Supervisor',
        basicSalary: 18000,
        dearnessAllowance: 3000,
        houseRentAllowance: 4000,
        conveyanceAllowance: 1500,
        specialAllowance: 2500,
        pfApplicable: true,
        esiApplicable: false, // Above ESI ceiling
        ptApplicable: true,
      },
    ];

    for (const ss of salaryStructures) {
      await db.salaryStructure.create({
        data: {
          organizationId: organization.id,
          ...ss
        }
      });
    }

    // Create compliance settings
    await db.complianceSetting.create({
      data: {
        organizationId: organization.id,
        state: body.state || 'MH',
        pfApplicable: true,
        esiApplicable: true,
        ptApplicable: true,
        lwfApplicable: body.state === 'MH',
      }
    });

    return NextResponse.json({
      success: true,
      organization,
      message: 'Organization setup completed successfully'
    });
  } catch (error) {
    console.error('Error during setup:', error);
    return NextResponse.json(
      { error: 'Failed to setup organization' },
      { status: 500 }
    );
  }
}
