import { z } from "zod";

// Constants for file validation
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

export const ACCEPTED_FILE_EXTENSIONS = ".jpg, .jpeg, .png, .pdf";

// File validation schema
export const fileSchema = z
  .custom<File>((val) => val instanceof File, {
    message: "Please upload a file",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size must be less than 5MB",
  })
  .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
    message: "Only .jpg, .jpeg, .png, and .pdf files are accepted",
  });

// Optional file schema (for optional documents)
export const optionalFileSchema = z
  .custom<File | null>((val) => val === null || val instanceof File, {
    message: "Invalid file",
  })
  .refine((file) => file === null || file.size <= MAX_FILE_SIZE, {
    message: "File size must be less than 5MB",
  })
  .refine(
    (file) => file === null || ACCEPTED_FILE_TYPES.includes(file.type),
    {
      message: "Only .jpg, .jpeg, .png, and .pdf files are accepted",
    }
  )
  .nullable();

// ============================================
// HLURB FORM ENUMS AND TYPES
// ============================================

// Project Nature types
export const PROJECT_NATURE_TYPES = [
  "NEW_DEVELOPMENT",
  "IMPROVEMENT",
  "OTHER",
] as const;

export type ProjectNatureType = (typeof PROJECT_NATURE_TYPES)[number];

export const PROJECT_NATURE_LABELS: Record<ProjectNatureType, string> = {
  NEW_DEVELOPMENT: "New Development",
  IMPROVEMENT: "Improvement",
  OTHER: "Other (Please specify)",
};

// Right Over Land types
export const RIGHT_OVER_LAND_TYPES = [
  "OWNER",
  "LEASE",
  "OTHER",
] as const;

export type RightOverLandType = (typeof RIGHT_OVER_LAND_TYPES)[number];

export const RIGHT_OVER_LAND_LABELS: Record<RightOverLandType, string> = {
  OWNER: "Owner",
  LEASE: "Lease",
  OTHER: "Other (Please specify)",
};

// Project Tenure types
export const PROJECT_TENURE_TYPES = [
  "PERMANENT",
  "TEMPORARY",
] as const;

export type ProjectTenureType = (typeof PROJECT_TENURE_TYPES)[number];

export const PROJECT_TENURE_LABELS: Record<ProjectTenureType, string> = {
  PERMANENT: "Permanent",
  TEMPORARY: "Temporary",
};

// Decision Release Mode types
export const DECISION_RELEASE_MODES = [
  "PICKUP_APPLICANT",
  "PICKUP_REPRESENTATIVE",
  "BY_MAIL",
] as const;

export type DecisionReleaseModeType = (typeof DECISION_RELEASE_MODES)[number];

export const DECISION_RELEASE_MODE_LABELS: Record<DecisionReleaseModeType, string> = {
  PICKUP_APPLICANT: "Pick-up by Applicant",
  PICKUP_REPRESENTATIVE: "Pick-up by Authorized Representative",
  BY_MAIL: "By mail",
};

// ============================================
// STEP 1: APPLICANT/CORPORATION DETAILS SCHEMA
// ============================================

export const applicantDetailsSchema = z.object({
  // Applicant Information
  applicantName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  applicantAddress: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(300, "Address must be less than 300 characters"),
  // Corporation Information (optional)
  corporationName: z.string().max(150, "Corporation name must be less than 150 characters").optional().or(z.literal("")),
  corporationAddress: z.string().max(300, "Corporation address must be less than 300 characters").optional().or(z.literal("")),
  // Authorized Representative Information (optional)
  representativeName: z.string().max(100, "Representative name must be less than 100 characters").optional().or(z.literal("")),
  representativeAddress: z.string().max(300, "Representative address must be less than 300 characters").optional().or(z.literal("")),
});

// ============================================
// STEP 2: PROJECT INFORMATION SCHEMA
// ============================================

export const projectInformationSchema = z.object({
  // 7. Project Type
  projectType: z
    .string()
    .min(2, "Project type is required")
    .max(200, "Project type must be less than 200 characters"),
  // 8. Project Nature
  projectNature: z.enum(PROJECT_NATURE_TYPES, {
    errorMap: () => ({ message: "Please select a project nature" }),
  }),
  projectNatureOther: z.string().max(200).optional().or(z.literal("")),
  // 9. Project Location
  projectLocation: z
    .string()
    .min(5, "Project location must be at least 5 characters")
    .max(500, "Project location must be less than 500 characters"),
  // 10. Project Area (in square meters)
  projectAreaLot: z
    .string()
    .min(1, "Lot area is required")
    .max(50, "Lot area must be less than 50 characters"),
  projectAreaBuilding: z.string().max(50).optional().or(z.literal("")),
  // 11. Right Over Land
  rightOverLand: z.enum(RIGHT_OVER_LAND_TYPES, {
    errorMap: () => ({ message: "Please select right over land" }),
  }),
  rightOverLandOther: z.string().max(100).optional().or(z.literal("")),
  // 12. Project Tenure
  projectTenure: z.enum(PROJECT_TENURE_TYPES, {
    errorMap: () => ({ message: "Please select project tenure" }),
  }),
  projectTenureYears: z.string().max(20).optional().or(z.literal("")),
  // 14. Project Cost/Capitalization
  projectCostFigure: z
    .string()
    .min(1, "Project cost (figure) is required")
    .max(50, "Project cost must be less than 50 characters"),
  projectCostWords: z
    .string()
    .min(5, "Project cost (words) is required")
    .max(300, "Project cost (words) must be less than 300 characters"),
});

// ============================================
// STEP 3: ZONING NOTICE HISTORY SCHEMA
// ============================================

export const zoningNoticeSchema = z.object({
  // 15. Is the project subject to written notice
  hasZoningNotice: z.boolean(),
  // 16. If yes, provide details
  zoningOfficerName: z.string().max(100).optional().or(z.literal("")),
  zoningNoticeDates: z.string().max(200).optional().or(z.literal("")),
  zoningNoticeOtherRequests: z.string().max(500).optional().or(z.literal("")),
});

// ============================================
// STEP 4: SIMILAR APPLICATION HISTORY SCHEMA
// ============================================

export const similarApplicationSchema = z.object({
  // 17. Has similar application been filed
  hasSimilarApplication: z.boolean(),
  // If yes, provide details
  similarApplicationOffices: z.string().max(300).optional().or(z.literal("")),
  similarApplicationDates: z.string().max(200).optional().or(z.literal("")),
  similarApplicationActions: z.string().max(500).optional().or(z.literal("")),
});

// ============================================
// STEP 5: DECISION DELIVERY SCHEMA
// ============================================

export const decisionDeliverySchema = z.object({
  // 18. Preferred Mode of Release
  decisionReleaseMode: z.enum(DECISION_RELEASE_MODES, {
    errorMap: () => ({ message: "Please select a delivery mode" }),
  }),
  mailAddress: z.string().max(300).optional().or(z.literal("")),
  // Signature confirmation
  signatureConfirmed: z.boolean(),
});

// ============================================
// DOCUMENT FIELD DEFINITIONS
// ============================================

// Document field keys for supporting documents
export type SupportingDocumentKey =
  | "proofOfOwnership"
  | "taxDeclaration"
  | "vicinityMap"
  | "siteDevelopmentPlan"
  | "otherDocuments";

// All document field keys
export type DocumentFieldKey = SupportingDocumentKey;

// Supporting documents schema
export const supportingDocumentsSchema = z.object({
  proofOfOwnership: optionalFileSchema,
  taxDeclaration: optionalFileSchema,
  vicinityMap: optionalFileSchema,
  siteDevelopmentPlan: optionalFileSchema,
  otherDocuments: optionalFileSchema,
});

// Supporting document fields metadata
export const supportingDocumentFields: {
  key: SupportingDocumentKey;
  label: string;
  description: string;
}[] = [
  {
    key: "proofOfOwnership",
    label: "Proof of Land Ownership/Right Over Land",
    description: "TCT, Tax Declaration, Lease Contract, or other proof of ownership",
  },
  {
    key: "taxDeclaration",
    label: "Tax Declaration/Real Property Tax Receipt",
    description: "Current year tax declaration or receipt",
  },
  {
    key: "vicinityMap",
    label: "Vicinity Map",
    description: "Map showing the project location",
  },
  {
    key: "siteDevelopmentPlan",
    label: "Site Development Plan",
    description: "Layout plan of the proposed project",
  },
  {
    key: "otherDocuments",
    label: "Other Supporting Documents",
    description: "Any additional documents required",
  },
];

// All document fields combined
export const allDocumentFields = [...supportingDocumentFields];

// ============================================
// COMPLETE APPLICATION SCHEMA
// ============================================

export const applicationSchema = z.object({
  applicantDetails: applicantDetailsSchema,
  projectInformation: projectInformationSchema,
  zoningNotice: zoningNoticeSchema,
  similarApplication: similarApplicationSchema,
  decisionDelivery: decisionDeliverySchema,
  documents: supportingDocumentsSchema,
});

// Types derived from schemas
export type ApplicantDetails = z.infer<typeof applicantDetailsSchema>;
export type ProjectInformation = z.infer<typeof projectInformationSchema>;
export type ZoningNotice = z.infer<typeof zoningNoticeSchema>;
export type SimilarApplication = z.infer<typeof similarApplicationSchema>;
export type DecisionDelivery = z.infer<typeof decisionDeliverySchema>;
export type Documents = z.infer<typeof supportingDocumentsSchema>;
export type ApplicationData = z.infer<typeof applicationSchema>;

// ============================================
// LEGACY EXPORTS FOR BACKWARD COMPATIBILITY
// ============================================

// Keep old types for any existing code that might reference them
export const LOT_OWNERSHIP_TYPES = RIGHT_OVER_LAND_TYPES;
export type LotOwnershipType = RightOverLandType;
export const LOT_OWNERSHIP_LABELS = RIGHT_OVER_LAND_LABELS;

export type RequiredDocumentKey = SupportingDocumentKey;
export type LotOwnershipDocumentKey = SupportingDocumentKey;
export type RepresentativeDocumentKey = SupportingDocumentKey;
export type COEDocumentKey = SupportingDocumentKey;

export const requiredDocumentFields = supportingDocumentFields;
export const lotOwnershipDocumentFields = supportingDocumentFields;
export const representativeDocumentFields = supportingDocumentFields;
export const coeDocumentFields = supportingDocumentFields;

export type RepresentativeDetails = {
  isRepresentative: boolean;
  representativeName: string;
};

export type ProjectDescription = {
  projectDescription: string;
  projectBoundaries: string;
  projectObjectives: string;
  zoningExceptionReason: string;
};

export const landOwnerDetailsSchema = applicantDetailsSchema;
export type LandOwnerDetails = ApplicantDetails;
export const documentFields = supportingDocumentFields;
