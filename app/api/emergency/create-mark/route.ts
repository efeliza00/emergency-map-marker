import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";

const emergencyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  contact_number: z
    .string()
    .min(7, "Contact number is too short")
    .max(15, "Contact number is too long")
    .regex(
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
      "Invalid phone number"
    ),
  severity: z
    .enum(["LOW", "MODERATE", "CRITICAL"])
    .transform(
      (val) => val.trim().toUpperCase() as "LOW" | "MODERATE" | "CRITICAL"
    ),
  latitude: z.number(),
  longitude: z.number(),
  landmarks: z.array(z.string()).optional(),
});
export async function POST(req: NextRequest) {
  const body = await req.json();
  const formData = emergencyFormSchema.parse(body);
  await prisma.emergencyMarker.create({
    data: formData,
  });
  console.log(formData);
  return NextResponse.json({
    status: true,
    message: "Request Submitted!",
  });
}
