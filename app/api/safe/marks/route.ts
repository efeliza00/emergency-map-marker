import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const markers = await prisma.safeMarker.findMany();
    return NextResponse.json(markers, { status: 200 });
  } catch (error) {
    // Safely check if the caught item is an actual Error object
    let errorMessage =
      "Failed to fetch emergency markers. An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      // If it's not an Error object, you can stringify it for logging
      errorMessage = String(error);
    }

    console.error("Error fetching safe markers:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch safe markers. Please try again later.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
