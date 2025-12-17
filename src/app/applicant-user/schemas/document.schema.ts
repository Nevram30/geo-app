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

// Lot ownership types enum
export const LOT_OWNERSHIP_TYPES = [
  "TRANSFER_CERTIFICATE_OF_TITLE",
  "LEASE_CONTRACT",
  "AWARD_NOTICE",
  "DEED_OF_SALE",
  "MEMORANDUM_OF_AGREEMENT",
  "AFFIDAVIT_OF_CONSENT",
  "SPECIAL_POWER_OF_ATTORNEY",
] as const;

export type LotOwnershipType = (typeof LOT_OWNERSHIP_TYPES)[number];

// Lot ownership type labels
export const LOT_OWNERSHIP_LABELS: Record<LotOwnershipType, string> = {
  TRANSFER_CERTIFICATE_OF_TITLE: "Transfer Certificate of Title (1 certified true copy)",
  LEASE_CONTRACT: "Lease Contract (1 photocopy)",
  AWARD_NOTICE: "Award Notice (1 photocopy)",
  DEED_OF_SALE: "Deed of Sale (1 photocopy)",
  MEMORANDUM_OF_AGREEMENT: "Memorandum of Agreement (MOA) (1 photocopy)",
  AFFIDAVIT_OF_CONSENT: "Affidavit of Consent to Construct",
  SPECIAL_POWER_OF_ATTORNEY: "Special Power of Attorney (SPA) (1 photocopy)",
};

// Applicant details schema
export const applicantDetailsSchema = z.object({
  applicantName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  applicantAddress: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters"),
  applicantContact: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number must be less than 15 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid contact number format"),
  applicantEmail: z.string().email("Invalid email address"),
});

// Representative details schema
export const representativeDetailsSchema = z.object({
  isRepresentative: z.boolean(),
  representativeName: z.string().optional(),
});

// Project description schema (for COE)
export const projectDescriptionSchema = z.object({
  projectDescription: z
    .string()
    .min(10, "Project description must be at least 10 characters")
    .max(2000, "Project description must be less than 2000 characters"),
  projectBoundaries: z
    .string()
    .min(10, "Project boundaries must be at least 10 characters")
    .max(1000, "Project boundaries must be less than 1000 characters"),
  projectObjectives: z
    .string()
    .min(10, "Project objectives must be at least 10 characters")
    .max(1000, "Project objectives must be less than 1000 characters"),
  zoningExceptionReason: z
    .string()
    .min(10, "Reason must be at least 10 characters")
    .max(1000, "Reason must be less than 1000 characters"),
});

// ============================================
// DOCUMENT FIELD DEFINITIONS
// ============================================

// Document field keys for required documents
export type RequiredDocumentKey =
  | "taxClearanceOriginal"
  | "taxClearancePhotocopy"
  | "authorityToSign"
  | "lotPlan"
  | "architecturalPlan"
  | "professionalTaxReceipt";

// Document field keys for lot ownership documents
export type LotOwnershipDocumentKey =
  | "transferCertificateOfTitle"
  | "leaseContract"
  | "awardNotice"
  | "deedOfSale"
  | "memorandumOfAgreement"
  | "affidavitOfConsent"
  | "specialPowerOfAttorney";

// Document field keys for representative documents
export type RepresentativeDocumentKey =
  | "authorizationLetter"
  | "representedPersonId"
  | "representativeId";

// Document field keys for COE documents
export type COEDocumentKey =
  | "projectDescriptionDoc"
  | "projectDescriptionPhotocopy";

// All document field keys
export type DocumentFieldKey =
  | RequiredDocumentKey
  | LotOwnershipDocumentKey
  | RepresentativeDocumentKey
  | COEDocumentKey;

// Required documents schema
export const requiredDocumentsSchema = z.object({
  taxClearanceOriginal: fileSchema,
  taxClearancePhotocopy: fileSchema,
  authorityToSign: fileSchema,
  lotPlan: fileSchema,
  architecturalPlan: fileSchema,
  professionalTaxReceipt: fileSchema,
});

// Lot ownership documents schema (optional based on selection)
export const lotOwnershipDocumentsSchema = z.object({
  transferCertificateOfTitle: optionalFileSchema,
  leaseContract: optionalFileSchema,
  awardNotice: optionalFileSchema,
  deedOfSale: optionalFileSchema,
  memorandumOfAgreement: optionalFileSchema,
  affidavitOfConsent: optionalFileSchema,
  specialPowerOfAttorney: optionalFileSchema,
});

// Representative documents schema
export const representativeDocumentsSchema = z.object({
  authorizationLetter: optionalFileSchema,
  representedPersonId: optionalFileSchema,
  representativeId: optionalFileSchema,
});

// COE documents schema
export const coeDocumentsSchema = z.object({
  projectDescriptionDoc: fileSchema,
  projectDescriptionPhotocopy: fileSchema,
});

// Complete documents schema
export const documentsSchema = z.object({
  ...requiredDocumentsSchema.shape,
  ...lotOwnershipDocumentsSchema.shape,
  ...representativeDocumentsSchema.shape,
  ...coeDocumentsSchema.shape,
});

// Complete application schema
export const applicationSchema = z.object({
  applicantDetails: applicantDetailsSchema,
  representativeDetails: representativeDetailsSchema,
  projectDescription: projectDescriptionSchema,
  lotOwnershipType: z.enum(LOT_OWNERSHIP_TYPES),
  documents: documentsSchema,
  longFolder: z.boolean(),
});

// Types derived from schemas
export type ApplicantDetails = z.infer<typeof applicantDetailsSchema>;
export type RepresentativeDetails = z.infer<typeof representativeDetailsSchema>;
export type ProjectDescription = z.infer<typeof projectDescriptionSchema>;
export type Documents = z.infer<typeof documentsSchema>;
export type ApplicationData = z.infer<typeof applicationSchema>;

// ============================================
// DOCUMENT FIELD METADATA FOR UI
// ============================================

// Required document fields metadata
export const requiredDocumentFields: {
  key: RequiredDocumentKey;
  label: string;
  description: string;
}[] = [
  {
    key: "taxClearanceOriginal",
    label: "Tax Clearance/Real Property Tax Receipt & Bill (Original)",
    description: "1 original copy of current year",
  },
  {
    key: "taxClearancePhotocopy",
    label: "Tax Clearance/Real Property Tax Receipt & Bill (Photocopy)",
    description: "1 photocopy of current year",
  },
  {
    key: "authorityToSign",
    label: "Authority to Sign/Corporate Secretary's Affidavit",
    description: "1 photocopy",
  },
  {
    key: "lotPlan",
    label: "Lot Plan",
    description: "1 set signed & sealed",
  },
  {
    key: "architecturalPlan",
    label: "Architectural Plan",
    description: "2 sets signed & sealed",
  },
  {
    key: "professionalTaxReceipt",
    label: "Professional Tax Receipt (PTR)",
    description: "Valid PTR of the signing professional",
  },
];

// Lot ownership document fields metadata
export const lotOwnershipDocumentFields: {
  key: LotOwnershipDocumentKey;
  type: LotOwnershipType;
  label: string;
  description: string;
}[] = [
  {
    key: "transferCertificateOfTitle",
    type: "TRANSFER_CERTIFICATE_OF_TITLE",
    label: "Transfer Certificate of Title",
    description: "1 certified true copy",
  },
  {
    key: "leaseContract",
    type: "LEASE_CONTRACT",
    label: "Lease Contract",
    description: "1 photocopy",
  },
  {
    key: "awardNotice",
    type: "AWARD_NOTICE",
    label: "Award Notice",
    description: "1 photocopy",
  },
  {
    key: "deedOfSale",
    type: "DEED_OF_SALE",
    label: "Deed of Sale",
    description: "1 photocopy",
  },
  {
    key: "memorandumOfAgreement",
    type: "MEMORANDUM_OF_AGREEMENT",
    label: "Memorandum of Agreement (MOA)",
    description: "1 photocopy",
  },
  {
    key: "affidavitOfConsent",
    type: "AFFIDAVIT_OF_CONSENT",
    label: "Affidavit of Consent to Construct",
    description: "Notarized document",
  },
  {
    key: "specialPowerOfAttorney",
    type: "SPECIAL_POWER_OF_ATTORNEY",
    label: "Special Power of Attorney (SPA)",
    description: "1 photocopy",
  },
];

// Representative document fields metadata
export const representativeDocumentFields: {
  key: RepresentativeDocumentKey;
  label: string;
  description: string;
}[] = [
  {
    key: "authorizationLetter",
    label: "Duly Notarized Authorization Letter/Special Power of Attorney",
    description: "1 original",
  },
  {
    key: "representedPersonId",
    label: "Government Issued ID (Person Being Represented)",
    description: "1 photocopy of the card of the person being represented",
  },
  {
    key: "representativeId",
    label: "Government Issued ID (Representative)",
    description: "1 photocopy of the representative's ID card",
  },
];

// COE document fields metadata
export const coeDocumentFields: {
  key: COEDocumentKey;
  label: string;
  description: string;
}[] = [
  {
    key: "projectDescriptionDoc",
    label: "Project Description Document (Original)",
    description:
      "Boundaries, nature of operation/use, objectives, and statement why project cannot fulfill objectives under Zoning Regulations",
  },
  {
    key: "projectDescriptionPhotocopy",
    label: "Project Description Document (Photocopy)",
    description: "1 photocopy of the project description",
  },
];

// All document fields combined
export const allDocumentFields = [
  ...requiredDocumentFields,
  ...lotOwnershipDocumentFields,
  ...representativeDocumentFields,
  ...coeDocumentFields,
];

// Legacy exports for backward compatibility
export const landOwnerDetailsSchema = applicantDetailsSchema;
export type LandOwnerDetails = ApplicantDetails;
export const documentFields = requiredDocumentFields;
