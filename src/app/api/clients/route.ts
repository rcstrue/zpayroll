import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/clients - List all clients
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (status && status !== 'all') {
      where.isActive = status === 'active';
    }
    
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { clientCode: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const clients = await db.client.findMany({
      where,
      include: {
        _count: {
          select: {
            employeeDeployments: {
              where: { isActive: true }
            }
          }
        },
        clientLocations: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform data for frontend
    const transformedClients = clients.map(client => ({
      id: client.id,
      clientCode: client.clientCode,
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      contactPhone: client.contactPhone,
      contactEmail: client.contactEmail,
      city: client.city,
      state: client.state,
      activeDeployments: client._count.employeeDeployments,
      status: client.isActive ? 'active' : 'inactive',
      contractValue: client.contractValue || 0,
    }));

    return NextResponse.json({
      clients: transformedClients
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create new client
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

    // Generate client code
    const lastClient = await db.client.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    const sequence = lastClient 
      ? parseInt(lastClient.clientCode.replace(/\D/g, '')) + 1 
      : 1;
    const clientCode = `CLI${String(sequence).padStart(3, '0')}`;

    // Create client
    const client = await db.client.create({
      data: {
        organizationId: organization.id,
        clientCode,
        companyName: body.companyName,
        contactPerson: body.contactPerson,
        contactPhone: body.contactPhone,
        contactEmail: body.contactEmail,
        gstin: body.gstin,
        pan: body.pan,
        cin: body.cin,
        pfEstablishmentCode: body.pfEstablishmentCode,
        esiEstablishmentCode: body.esiEstablishmentCode,
        billingAddress: body.billingAddress,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        contractStartDate: body.contractStartDate ? new Date(body.contractStartDate) : null,
        contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : null,
        contractValue: body.contractValue,
        billingCycle: body.billingCycle || 'monthly',
        paymentTerms: body.paymentTerms || 30,
        serviceChargePercent: body.serviceChargePercent || 0,
        serviceChargeGst: body.serviceChargeGst || 18,
        isActive: true,
        notes: body.notes,
      }
    });

    return NextResponse.json({
      success: true,
      client,
      message: 'Client created successfully'
    });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
