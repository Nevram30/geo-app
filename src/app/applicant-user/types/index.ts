import type {
  ApplicantDetails,
  RepresentativeDetails,
  ProjectDescription,
  DocumentFieldKey,
  LotOwnershipType,
  RequiredDocumentKey,
  LotOwnershipDocumentKey,
  RepresentativeDocumentKey,
  COEDocumentKey,
} from "../schemas/document.schema";

// Re-export types from schema
export type { DocumentFieldKey, LotOwnershipType };

// Form step definition
export interface FormStep {
  id: number;
  title: string;
  description: string;
}

// Application form steps
export const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: "Applicant Details",
    description: "Provide your personal information",
  },
  {
    id: 2,
    title: "Proof of Lot Ownership",
    description: "Select and upload proof of lot ownership",
  },
  {
    id: 3,
    title: "Required Documents",
    description: "Upload required official documents",
  },
  {
    id: 4,
    title: "Representative Info",
    description: "For representative applications only",
  },
  {
    id: 5,
    title: "COE Requirements",
    description: "Certificate of Exception requirements",
  },
  {
    id: 6,
    title: "Review & Submit",
    description: "Review your application before submission",
  },
];

// File upload state
export interface FileUploadState {
  file: File | null;
  preview: string | null;
  error: string | null;
  isUploading: boolean;
}

// Required documents state
export type RequiredDocumentsState = Record<RequiredDocumentKey, FileUploadState>;

// Lot ownership documents state
export type LotOwnershipDocumentsState = Record<LotOwnershipDocumentKey, FileUploadState>;

// Representative documents state
export type RepresentativeDocumentsState = Record<RepresentativeDocumentKey, FileUploadState>;

// COE documents state
export type COEDocumentsState = Record<COEDocumentKey, FileUploadState>;

// All documents state
export type DocumentsState = Record<DocumentFieldKey, FileUploadState>;

// Form state
export interface ApplicationFormState {
  currentStep: number;
  applicantDetails: ApplicantDetails;
  representativeDetails: RepresentativeDetails;
  projectDescription: ProjectDescription;
  lotOwnershipType: LotOwnershipType | null;
  documents: DocumentsState;
  longFolder: boolean;
  isSubmitting: boolean;
  submitError: string | null;
}

// Initial applicant details
export const initialApplicantDetails: ApplicantDetails = {
  applicantName: "",
  applicantAddress: "",
  applicantContact: "",
  applicantEmail: "",
};

// Initial representative details
export const initialRepresentativeDetails: RepresentativeDetails = {
  isRepresentative: false,
  representativeName: "",
};

// Initial project description
export const initialProjectDescription: ProjectDescription = {
  projectDescription: "",
  projectBoundaries: "",
  projectObjectives: "",
  zoningExceptionReason: "",
};

// Initial file upload state
export const initialFileUploadState: FileUploadState = {
  file: null,
  preview: null,
  error: null,
  isUploading: false,
};

// Initial documents state
export const initialDocumentsState: DocumentsState = {
  // Required documents
  taxClearanceOriginal: { ...initialFileUploadState },
  taxClearancePhotocopy: { ...initialFileUploadState },
  authorityToSign: { ...initialFileUploadState },
  lotPlan: { ...initialFileUploadState },
  architecturalPlan: { ...initialFileUploadState },
  professionalTaxReceipt: { ...initialFileUploadState },
  // Lot ownership documents
  transferCertificateOfTitle: { ...initialFileUploadState },
  leaseContract: { ...initialFileUploadState },
  awardNotice: { ...initialFileUploadState },
  deedOfSale: { ...initialFileUploadState },
  memorandumOfAgreement: { ...initialFileUploadState },
  affidavitOfConsent: { ...initialFileUploadState },
  specialPowerOfAttorney: { ...initialFileUploadState },
  // Representative documents
  authorizationLetter: { ...initialFileUploadState },
  representedPersonId: { ...initialFileUploadState },
  representativeId: { ...initialFileUploadState },
  // COE documents
  projectDescriptionDoc: { ...initialFileUploadState },
  projectDescriptionPhotocopy: { ...initialFileUploadState },
};

// Validation result type
export interface ValidationResult {
  success: boolean;
  errors: Record<string, string>;
}

// Form field props
export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

// File upload props
export interface FileUploadProps {
  label: string;
  description: string;
  fieldKey: DocumentFieldKey;
  state: FileUploadState;
  onFileSelect: (fieldKey: DocumentFieldKey, file: File) => void;
  onFileRemove: (fieldKey: DocumentFieldKey) => void;
  required?: boolean;
}

// Legacy exports for backward compatibility
export type { ApplicantDetails as LandOwnerDetails } from "../schemas/document.schema";
export const initialLandOwnerDetails = initialApplicantDetails;
