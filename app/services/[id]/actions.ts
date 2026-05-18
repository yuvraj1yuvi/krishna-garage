"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addServicePart(formData: FormData) {
  const serviceId = parseInt(formData.get("serviceId") as string);
  const partName = formData.get("partName") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const price = parseFloat(formData.get("price") as string);

  await prisma.servicePart.create({
    data: {
      serviceId,
      partName,
      quantity,
      price,
    }
  });

  // Automatically update the total cost of the service
  const parts = await prisma.servicePart.findMany({ where: { serviceId } });
  const total = parts.reduce((acc: any, part: any) => acc + (Number(part.price) * part.quantity), 0);

  await prisma.service.update({
    where: { id: serviceId },
    data: { totalCost: total }
  });

  revalidatePath(`/services/${serviceId}`);
}

export async function removeServicePart(formData: FormData) {
  const partId = parseInt(formData.get("partId") as string);
  const serviceId = parseInt(formData.get("serviceId") as string);

  await prisma.servicePart.delete({
    where: { id: partId }
  });

  // Automatically update the total cost of the service
  const parts = await prisma.servicePart.findMany({ where: { serviceId } });
  const total = parts.reduce((acc: any, part: any) => acc + (Number(part.price) * part.quantity), 0);

  await prisma.service.update({
    where: { id: serviceId },
    data: { totalCost: total }
  });

  revalidatePath(`/services/${serviceId}`);
}

export async function updateServiceStatus(formData: FormData) {
  const serviceId = parseInt(formData.get("serviceId") as string);
  const status = formData.get("status") as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DELIVERED";

  const data: any = { status };
  
  if (status === 'COMPLETED') data.completedAt = new Date();
  if (status === 'DELIVERED') data.deliveredAt = new Date();

  await prisma.service.update({
    where: { id: serviceId },
    data
  });

  revalidatePath(`/services/${serviceId}`);
}
