import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { uploadToS3 } from "~/lib/s3";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to upload files." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const fieldName = formData.get("fieldName") as string | null;

    if (!file || !fieldName) {
      return NextResponse.json(
        { error: "File and fieldName are required" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed types: JPEG, PNG, PDF" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Upload to S3 through server
    // Pass user ID for supporting documents (otherDocuments) to create user-specific folder
    const userId = session.user.id;
    const result = await uploadToS3(file, "temp", fieldName, userId);

    return NextResponse.json({
      key: result.key,
      url: result.url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
