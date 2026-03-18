import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { customer: true }
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const vehicle = await prisma.vehicle.create({
      data: {
        customerId: data.customerId,
        vehicleNumber: data.vehicleNumber,
        vehicleType: data.vehicleType,
        brand: data.brand,
        model: data.model,
        createdBy: 1,
        updatedBy: 1,
      },
    });
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
  }
}
