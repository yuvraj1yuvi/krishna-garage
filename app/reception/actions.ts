"use server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function searchVehicle(vehicleNumber: string) {
  const vehicle = await prisma.vehicle.findFirst({
    where: { vehicleNumber },
    include: { customer: true }
  });
  return vehicle;
}

export async function createReceptionJob(formData: FormData) {
  const vehicleNumber = formData.get("vehicleNumber") as string;
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;
  const vehicleType = formData.get("vehicleType") as string;

  const isNewCustomer = formData.get("isNewCustomer") === "true";
  let customerId = parseInt(formData.get("customerId") as string);

  // If a new customer is selected or required
  if (isNewCustomer || isNaN(customerId)) {
    const customer = await prisma.customer.create({
      data: {
        name: formData.get("customerName") as string,
        phone: formData.get("customerPhone") as string,
        address: formData.get("customerAddress") as string,
        createdBy: 1,
        updatedBy: 1,
      }
    });
    customerId = customer.id;
  }

  // Find or create vehicle
  let vehicle = await prisma.vehicle.findFirst({ where: { vehicleNumber } });
  
  if (!vehicle) {
    vehicle = await prisma.vehicle.create({
      data: {
        vehicleNumber,
        brand,
        model,
        vehicleType,
        customerId,
        createdBy: 1,
        updatedBy: 1,
      }
    });
  } else if (vehicle.customerId !== customerId) {
    // If it's a new owner taking over the vehicle
    vehicle = await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { customerId }
    });
  }

  // Create Service Job in IN_PROGRESS state
  const service = await prisma.service.create({
    data: {
      customerId,
      vehicleId: vehicle.id,
      serviceDate: new Date(),
      problemDescription: formData.get("problemDescription") as string,
      status: "IN_PROGRESS",
      startedAt: new Date(),
      createdBy: 1,
      updatedBy: 1,
    }
  });

  // Redirect to the detailed job estimate view
  redirect(`/services/${service.id}`);
}
