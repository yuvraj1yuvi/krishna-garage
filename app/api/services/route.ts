import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: { customer: true, vehicle: true }
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const service = await prisma.service.create({
      data: {
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        serviceDate: new Date(data.serviceDate),
        problemDescription: data.problemDescription,
        status: data.status || 'PENDING',
        createdBy: 1,
        updatedBy: 1,
      },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create service job' }, { status: 500 });
  }
}
