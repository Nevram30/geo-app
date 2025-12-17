import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { z } from "zod";

// Application validation schema
const applicationSchema = z.object({
  applicantName: z.string().min(2),
  applicantAddress: z.string().min(5),
  applicantContact: z.string().min(10),
  applicantEmail: z.string().email(),
  isRepresentative: z.string().transform((val) => val === "true"),
  representativeName: z.string().optional(),
  projectDescription: z.string().min(10),
  projectBoundaries: z.string().min(10),
  projectObjectives: z.string().min(10),
  zoningExceptionReason: z.string().min(10),
  lotOwnershipType: z.enum([
    "TRANSFER_CERTIFICATE_OF_TITLE",
    "LEASE_CONTRACT",
    "AWARD_NOTICE",
    "DEED_OF_SALE",
    "MEMORANDUM_OF_AGREEMENT",
    "AFFIDAVIT_OF_CONSENT",
    "SPECIAL_POWER_OF_ATTORNEY",
  ]),
  longFolder: z.string().transform((val) => val === "true"),
});

// Generate unique application number
function generateApplicationNo(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ZA-${year}${month}${day}-${random}`;
}

// Save uploaded file and return the path
async function saveFile(
  file: File,
  applicationNo: string,
  fieldName: string
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), "public", "uploads", applicationNo);
  await mkdir(uploadsDir, { recursive: true });

  // Generate unique filename
  const ext = path.extname(file.name);
  const filename = `${fieldName}-${Date.now()}${ext}`;
  const filepath = path.join(uploadsDir, filename);

  await writeFile(filepath, buffer);

  // Return relative path for storage
  return `/uploads/${applicationNo}/${filename}`;
}

// GET - List applications (for authenticated users)
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const skip = (page - 1) * limit;

    // Build filter
    const where: Record<string, unknown> = {};

    // If user is an applicant, only show their own applications
    if (session.user.role === "APPLICANT") {
      where.userId = session.user.id;
    }

    if (status) {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      db.zoningApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      db.zoningApplication.count({ where }),
    ]);

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching applications" },
      { status: 500 }
    );
  }
}

// POST - Create new application
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to submit an application." },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    // Extract form fields
    const formFields: Record<string, string> = {};
    const files: Record<string, File> = {};

    formData.forEach((value, key) => {
      if (value instanceof File) {
        files[key] = value;
      } else {
        formFields[key] = value;
      }
    });

    // Validate form data
    const validatedData = applicationSchema.parse(formFields);

    // Generate application number
    const applicationNo = generateApplicationNo();

    // Save files and get their paths
    const filePaths: Record<string, string> = {};

    for (const [fieldName, file] of Object.entries(files)) {
      if (file.size > 0) {
        filePaths[fieldName] = await saveFile(file, applicationNo, fieldName);
      }
    }

    // Create application in database
    const application = await db.zoningApplication.create({
      data: {
        applicationNo,
        userId: session.user.id,

        // Applicant details
        applicantName: validatedData.applicantName,
        applicantAddress: validatedData.applicantAddress,
        applicantContact: validatedData.applicantContact,
        applicantEmail: validatedData.applicantEmail,

        // Representative details
        isRepresentative: validatedData.isRepresentative,
        representativeName: validatedData.representativeName,

        // Project description
        projectDescription: validatedData.projectDescription,
        projectBoundaries: validatedData.projectBoundaries,
        projectObjectives: validatedData.projectObjectives,
        zoningExceptionReason: validatedData.zoningExceptionReason,

        // Lot ownership
        lotOwnershipType: validatedData.lotOwnershipType,

        // Document paths
        taxClearanceOriginal: filePaths.taxClearanceOriginal,
        taxClearancePhotocopy: filePaths.taxClearancePhotocopy,
        transferCertificateOfTitle: filePaths.transferCertificateOfTitle,
        leaseContract: filePaths.leaseContract,
        awardNotice: filePaths.awardNotice,
        deedOfSale: filePaths.deedOfSale,
        memorandumOfAgreement: filePaths.memorandumOfAgreement,
        affidavitOfConsent: filePaths.affidavitOfConsent,
        specialPowerOfAttorney: filePaths.specialPowerOfAttorney,
        authorityToSign: filePaths.authorityToSign,
        lotPlan: filePaths.lotPlan,
        architecturalPlan: filePaths.architecturalPlan,
        professionalTaxReceipt: filePaths.professionalTaxReceipt,
        projectDescriptionDoc: filePaths.projectDescriptionDoc,
        projectDescriptionPhotocopy: filePaths.projectDescriptionPhotocopy,
        authorizationLetter: filePaths.authorizationLetter,
        representedPersonId: filePaths.representedPersonId,
        representativeId: filePaths.representativeId,

        // Other fields
        longFolder: validatedData.longFolder,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        applicationNo: application.applicationNo,
        id: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "An error occurred during application submission" },
      { status: 500 }
    );
  }
}
