import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { z } from "zod";

// Application validation schema - matches what the form actually sends
const applicationSchema = z.object({
  // Applicant Details (Step 1)
  applicantName: z.string().min(2),
  applicantAddress: z.string().min(5),
  corporationName: z.string().optional(),
  corporationAddress: z.string().optional(),
  representativeName: z.string().optional(),
  representativeAddress: z.string().optional(),

  // Project Information (Step 2)
  projectType: z.string().optional(),
  projectNature: z.string().optional(),
  projectNatureOther: z.string().optional(),
  projectLocation: z.string().optional(),
  projectAreaLot: z.string().optional(),
  projectAreaBuilding: z.string().optional(),
  rightOverLand: z.string().optional(),
  rightOverLandOther: z.string().optional(),
  projectTenure: z.string().optional(),
  projectTenureYears: z.string().optional(),
  projectCostFigure: z.string().optional(),
  projectCostWords: z.string().optional(),

  // Zoning Notice (Step 3)
  hasZoningNotice: z.string().transform((val) => val === "true").optional(),
  zoningOfficerName: z.string().optional(),
  zoningNoticeDates: z.string().optional(),
  zoningNoticeOtherRequests: z.string().optional(),

  // Similar Application (Step 4)
  hasSimilarApplication: z.string().transform((val) => val === "true").optional(),
  similarApplicationOffices: z.string().optional(),
  similarApplicationDates: z.string().optional(),
  similarApplicationActions: z.string().optional(),

  // Decision Delivery (Step 5)
  decisionReleaseMode: z.string().optional(),
  mailAddress: z.string().optional(),
  signatureConfirmed: z.string().transform((val) => val === "true").optional(),
});

// Document field keys that contain S3 URLs
const documentFields = [
  "proofOfOwnership",
  "taxDeclaration",
  "vicinityMap",
  "siteDevelopmentPlan",
  "otherDocuments",
  "taxClearanceOriginal",
  "taxClearancePhotocopy",
  "transferCertificateOfTitle",
  "leaseContract",
  "awardNotice",
  "deedOfSale",
  "memorandumOfAgreement",
  "affidavitOfConsent",
  "specialPowerOfAttorney",
  "authorityToSign",
  "lotPlan",
  "architecturalPlan",
  "professionalTaxReceipt",
  "projectDescriptionDoc",
  "projectDescriptionPhotocopy",
  "authorizationLetter",
  "representedPersonId",
  "representativeId",
];

// Generate unique application number
function generateApplicationNo(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ZA-${year}${month}${day}-${random}`;
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

    // Extract form fields and document URLs
    const formFields: Record<string, string> = {};
    const documentUrls: Record<string, string> = {};

    formData.forEach((value, key) => {
      if (typeof value === "string") {
        // Check if this is a document field (S3 URL)
        if (documentFields.includes(key) && value.startsWith("https://")) {
          documentUrls[key] = value;
        } else {
          formFields[key] = value;
        }
      }
    });

    // Validate form data
    const validatedData = applicationSchema.parse(formFields);

    // Generate application number
    const applicationNo = generateApplicationNo();

    // Map rightOverLand to lotOwnershipType if it's a valid enum value
    const lotOwnershipTypeMap: Record<string, string> = {
      OWNER: "TRANSFER_CERTIFICATE_OF_TITLE",
      LESSEE: "LEASE_CONTRACT",
      AWARDEE: "AWARD_NOTICE",
    };
    const mappedLotOwnershipType = validatedData.rightOverLand
      ? lotOwnershipTypeMap[validatedData.rightOverLand]
      : undefined;

    // Create application in database
    const application = await db.zoningApplication.create({
      data: {
        applicationNo,
        userId: session.user.id,

        // Applicant details
        applicantName: validatedData.applicantName,
        applicantAddress: validatedData.applicantAddress,
        // Use session email as fallback for required DB fields
        applicantContact: session.user.name ?? validatedData.applicantName,
        applicantEmail: session.user.email ?? "not-provided@example.com",

        // Representative details
        isRepresentative: !!validatedData.representativeName,
        representativeName: validatedData.representativeName,

        // Project description (use projectType as description if available)
        projectDescription: validatedData.projectType,

        // Lot ownership - map from rightOverLand
        lotOwnershipType: mappedLotOwnershipType as "TRANSFER_CERTIFICATE_OF_TITLE" | "LEASE_CONTRACT" | "AWARD_NOTICE" | "DEED_OF_SALE" | "MEMORANDUM_OF_AGREEMENT" | "AFFIDAVIT_OF_CONSENT" | "SPECIAL_POWER_OF_ATTORNEY" | undefined,

        // Document S3 URLs
        taxClearanceOriginal: documentUrls.taxClearanceOriginal,
        taxClearancePhotocopy: documentUrls.taxClearancePhotocopy,
        transferCertificateOfTitle: documentUrls.transferCertificateOfTitle,
        leaseContract: documentUrls.leaseContract,
        awardNotice: documentUrls.awardNotice,
        deedOfSale: documentUrls.deedOfSale,
        memorandumOfAgreement: documentUrls.memorandumOfAgreement,
        affidavitOfConsent: documentUrls.affidavitOfConsent,
        specialPowerOfAttorney: documentUrls.specialPowerOfAttorney,
        authorityToSign: documentUrls.authorityToSign,
        lotPlan: documentUrls.lotPlan,
        architecturalPlan: documentUrls.architecturalPlan,
        professionalTaxReceipt: documentUrls.professionalTaxReceipt,
        projectDescriptionDoc: documentUrls.projectDescriptionDoc,
        projectDescriptionPhotocopy: documentUrls.projectDescriptionPhotocopy,
        authorizationLetter: documentUrls.authorizationLetter,
        representedPersonId: documentUrls.representedPersonId,
        representativeId: documentUrls.representativeId,
        // Supporting documents
        proofOfOwnership: documentUrls.proofOfOwnership,
        taxDeclaration: documentUrls.taxDeclaration,
        vicinityMap: documentUrls.vicinityMap,
        siteDevelopmentPlan: documentUrls.siteDevelopmentPlan,
        otherDocuments: documentUrls.otherDocuments,

        // Other fields
        longFolder: false,
        status: "SUBMITTED",
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
