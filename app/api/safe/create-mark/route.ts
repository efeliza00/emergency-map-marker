import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";

const safeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  latitude: z.number(),
  longitude: z.number(),
});
export async function POST(req: NextRequest) {
  const body = await req.json();
  const formData = safeFormSchema.parse(body);
  await prisma.safeMarker.create({
    data: formData,
  });
  console.log(formData);
  return NextResponse.json({
    status: true,
    message: "Request Submitted!",
  });
}
