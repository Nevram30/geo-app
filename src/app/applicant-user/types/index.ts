import type {
  ApplicantDetails,
  ProjectInformation,
  ZoningNotice,
  SimilarApplication,
  DecisionDelivery,
  DocumentFieldKey,
  SupportingDocumentKey,
  ProjectNatureType,
  RightOverLandType,
  ProjectTenureType,
  DecisionReleaseModeType,
} from "../schemas/document.schema";

// Re-export types from schema
export type {
  DocumentFieldKey,
  SupportingDocumentKey,
  ProjectNatureType,
  RightOverLandType,
  ProjectTenureType,
  DecisionReleaseModeType,
};

// Form step definition
export interface FormStep {
  id: number;
  title: string;
  description: string;
}

// Application form steps based on HLURB form
export const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: "Applicant/Corporation Details",
    description: "Provide applicant and corporation information",
  },
  {
    id: 2,
    title: "Project Information",
    description: "Enter project details and specifications",
  },
  {
    id: 3,
    title: "Zoning Notice History",
    description: "Previous zoning notices from HLURB",
  },
  {
    id: 4,
    title: "Similar Applications",
    description: "History of similar applications filed",
  },
  {
    id: 5,
    title: "Decision Delivery",
    description: "Select how to receive the decision",
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

// All documents state
export type DocumentsState = Record<DocumentFieldKey, FileUploadState>;

// Form state
export interface ApplicationFormState {
  currentStep: number;
  applicantDetails: ApplicantDetails;
  projectInformation: ProjectInformation;
  zoningNotice: ZoningNotice;
  similarApplication: SimilarApplication;
  decisionDelivery: DecisionDelivery;
  documents: DocumentsState;
  isSubmitting: boolean;
  submitError: string | null;
}

// Initial applicant details
export const initialApplicantDetails: ApplicantDetails = {
  applicantName: "",
  applicantAddress: "",
  corporationName: "",
  corporationAddress: "",
  representativeName: "",
  representativeAddress: "",
};

// Initial project information
export const initialProjectInformation: ProjectInformation = {
  projectType: "",
  projectNature: "NEW_DEVELOPMENT",
  projectNatureOther: "",
  projectLocation: "",
  projectAreaLot: "",
  projectAreaBuilding: "",
  rightOverLand: "OWNER",
  rightOverLandOther: "",
  projectTenure: "PERMANENT",
  projectTenureYears: "",
  projectCostFigure: "",
  projectCostWords: "",
};

// Initial zoning notice
export const initialZoningNotice: ZoningNotice = {
  hasZoningNotice: false,
  zoningOfficerName: "",
  zoningNoticeDates: "",
  zoningNoticeOtherRequests: "",
};

// Initial similar application
export const initialSimilarApplication: SimilarApplication = {
  hasSimilarApplication: false,
  similarApplicationOffices: "",
  similarApplicationDates: "",
  similarApplicationActions: "",
};

// Initial decision delivery
export const initialDecisionDelivery: DecisionDelivery = {
  decisionReleaseMode: "PICKUP_APPLICANT",
  mailAddress: "",
  signatureConfirmed: false,
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
  proofOfOwnership: { ...initialFileUploadState },
  taxDeclaration: { ...initialFileUploadState },
  vicinityMap: { ...initialFileUploadState },
  siteDevelopmentPlan: { ...initialFileUploadState },
  otherDocuments: { ...initialFileUploadState },
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

// ============================================
// LEGACY EXPORTS FOR BACKWARD COMPATIBILITY
// ============================================

// Keep old types for any existing code that might reference them
export type LotOwnershipType = RightOverLandType;

export type RequiredDocumentsState = DocumentsState;
export type LotOwnershipDocumentsState = DocumentsState;
export type RepresentativeDocumentsState = DocumentsState;
export type COEDocumentsState = DocumentsState;

// Legacy initial states
export const initialRepresentativeDetails = {
  isRepresentative: false,
  representativeName: "",
};

export const initialProjectDescription = {
  projectDescription: "",
  projectBoundaries: "",
  projectObjectives: "",
  zoningExceptionReason: "",
};

// Legacy exports for backward compatibility
export type { ApplicantDetails as LandOwnerDetails } from "../schemas/document.schema";
export const initialLandOwnerDetails = initialApplicantDetails;
