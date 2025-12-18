import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { getPresignedUploadUrl } from "~/lib/s3";
import { z } from "zod";

const requestSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  fieldName: z.string().min(1),
  applicationNo: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to upload files." },
        { status: 401 }
      );
    }

    const body: unknown = await req.json();
    const { filename, contentType, fieldName, applicationNo } = requestSchema.parse(body);

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed types: JPEG, PNG, PDF" },
        { status: 400 }
      );
    }

    const result = await getPresignedUploadUrl(
      filename,
      contentType,
      fieldName,
      applicationNo
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Presigned URL generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate upload URL";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
