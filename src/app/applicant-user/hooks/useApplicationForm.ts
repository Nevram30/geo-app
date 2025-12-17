"use client";

import { useState, useCallback } from "react";
import type {
  ApplicantDetails,
  RepresentativeDetails,
  ProjectDescription,
  LotOwnershipType,
  DocumentFieldKey,
} from "../schemas/document.schema";
import {
  applicantDetailsSchema,
  projectDescriptionSchema,
  fileSchema,
  requiredDocumentFields,
  lotOwnershipDocumentFields,
  representativeDocumentFields,
  coeDocumentFields,
} from "../schemas/document.schema";
import type { DocumentsState, ValidationResult } from "../types";
import {
  initialApplicantDetails,
  initialRepresentativeDetails,
  initialProjectDescription,
  initialDocumentsState,
  initialFileUploadState,
} from "../types";

const TOTAL_STEPS = 6;

export function useApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicantDetails, setApplicantDetails] = useState<ApplicantDetails>(
    initialApplicantDetails
  );
  const [representativeDetails, setRepresentativeDetails] =
    useState<RepresentativeDetails>(initialRepresentativeDetails);
  const [projectDescription, setProjectDescription] =
    useState<ProjectDescription>(initialProjectDescription);
  const [lotOwnershipType, setLotOwnershipType] =
    useState<LotOwnershipType | null>(null);
  const [documents, setDocuments] = useState<DocumentsState>(initialDocumentsState);
  const [longFolder, setLongFolder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Handle applicant details change
  const handleApplicantDetailsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setApplicantDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (fieldErrors[name]) {
        setFieldErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    },
    [fieldErrors]
  );

  // Handle representative details change
  const handleRepresentativeDetailsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setRepresentativeDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (fieldErrors[name]) {
        setFieldErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    },
    [fieldErrors]
  );

  // Handle representative checkbox change
  const handleRepresentativeCheckboxChange = useCallback((checked: boolean) => {
    setRepresentativeDetails((prev) => ({
      ...prev,
      isRepresentative: checked,
    }));
  }, []);

  // Handle project description change
  const handleProjectDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProjectDescription((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (fieldErrors[name]) {
        setFieldErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    },
    [fieldErrors]
  );

  // Handle long folder checkbox change
  const handleLongFolderChange = useCallback((checked: boolean) => {
    setLongFolder(checked);
  }, []);

  // Handle lot ownership type selection
  const handleLotOwnershipTypeSelect = useCallback((type: LotOwnershipType) => {
    setLotOwnershipType(type);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(
    (fieldKey: DocumentFieldKey, file: File) => {
      const validation = fileSchema.safeParse(file);

      if (!validation.success) {
        const errorMessage = validation.error.errors[0]?.message ?? "Invalid file";
        setDocuments((prev) => ({
          ...prev,
          [fieldKey]: {
            ...prev[fieldKey],
            error: errorMessage,
          },
        }));
        return;
      }

      let preview: string | null = null;
      if (file.type.startsWith("image/")) {
        preview = URL.createObjectURL(file);
      }

      setDocuments((prev) => ({
        ...prev,
        [fieldKey]: {
          file,
          preview,
          error: null,
          isUploading: false,
        },
      }));
    },
    []
  );

  // Handle file removal
  const handleFileRemove = useCallback((fieldKey: DocumentFieldKey) => {
    setDocuments((prev) => {
      if (prev[fieldKey].preview) {
        URL.revokeObjectURL(prev[fieldKey].preview);
      }
      return {
        ...prev,
        [fieldKey]: { ...initialFileUploadState },
      };
    });
  }, []);

  // Validate step 1 (applicant details)
  const validateStep1 = useCallback((): ValidationResult => {
    const result = applicantDetailsSchema.safeParse(applicantDetails);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0];
        if (path && typeof path === "string") {
          errors[path] = err.message;
        }
      });
      setFieldErrors(errors);
      return { success: false, errors };
    }

    setFieldErrors({});
    return { success: true, errors: {} };
  }, [applicantDetails]);

  // Validate step 2 (lot ownership)
  const validateStep2 = useCallback((): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!lotOwnershipType) {
      errors.lotOwnershipType = "Please select a proof of lot ownership type";
      setFieldErrors(errors);
      return { success: false, errors };
    }

    // Check if the selected document is uploaded
    const selectedField = lotOwnershipDocumentFields.find(
      (f) => f.type === lotOwnershipType
    );

    if (selectedField && !documents[selectedField.key]?.file) {
      errors[selectedField.key] = "Please upload the selected document";
      setDocuments((prev) => ({
        ...prev,
        [selectedField.key]: {
          ...prev[selectedField.key],
          error: "This document is required",
        },
      }));
      return { success: false, errors };
    }

    setFieldErrors({});
    return { success: true, errors: {} };
  }, [lotOwnershipType, documents]);

  // Validate step 3 (required documents)
  const validateStep3 = useCallback((): ValidationResult => {
    const errors: Record<string, string> = {};
    let hasErrors = false;

    requiredDocumentFields.forEach(({ key }) => {
      const fileState = documents[key];
      if (!fileState.file) {
        errors[key] = "This document is required";
        hasErrors = true;
        setDocuments((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            error: "This document is required",
          },
        }));
      }
    });

    return { success: !hasErrors, errors };
  }, [documents]);

  // Validate step 4 (representative info)
  const validateStep4 = useCallback((): ValidationResult => {
    if (!representativeDetails.isRepresentative) {
      return { success: true, errors: {} };
    }

    const errors: Record<string, string> = {};
    let hasErrors = false;

    // Validate representative name
    if (!representativeDetails.representativeName?.trim()) {
      errors.representativeName = "Representative name is required";
      hasErrors = true;
    }

    // Validate representative documents
    representativeDocumentFields.forEach(({ key }) => {
      const fileState = documents[key];
      if (!fileState.file) {
        errors[key] = "This document is required";
        hasErrors = true;
        setDocuments((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            error: "This document is required",
          },
        }));
      }
    });

    if (hasErrors) {
      setFieldErrors(errors);
    }

    return { success: !hasErrors, errors };
  }, [representativeDetails, documents]);

  // Validate step 5 (COE requirements)
  const validateStep5 = useCallback((): ValidationResult => {
    const errors: Record<string, string> = {};
    let hasErrors = false;

    // Validate project description
    const projectResult = projectDescriptionSchema.safeParse(projectDescription);
    if (!projectResult.success) {
      projectResult.error.errors.forEach((err) => {
        const path = err.path[0];
        if (path && typeof path === "string") {
          errors[path] = err.message;
          hasErrors = true;
        }
      });
    }

    // Validate COE documents
    coeDocumentFields.forEach(({ key }) => {
      const fileState = documents[key];
      if (!fileState.file) {
        errors[key] = "This document is required";
        hasErrors = true;
        setDocuments((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            error: "This document is required",
          },
        }));
      }
    });

    if (hasErrors) {
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
    }

    return { success: !hasErrors, errors };
  }, [projectDescription, documents]);

  // Go to next step
  const nextStep = useCallback(() => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1().success;
        break;
      case 2:
        isValid = validateStep2().success;
        break;
      case 3:
        isValid = validateStep3().success;
        break;
      case 4:
        isValid = validateStep4().success;
        break;
      case 5:
        isValid = validateStep5().success;
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  }, [currentStep, validateStep1, validateStep2, validateStep3, validateStep4, validateStep5]);

  // Go to previous step
  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // Submit form
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate all steps
      const step1Valid = validateStep1();
      const step2Valid = validateStep2();
      const step3Valid = validateStep3();
      const step4Valid = validateStep4();
      const step5Valid = validateStep5();

      if (
        !step1Valid.success ||
        !step2Valid.success ||
        !step3Valid.success ||
        !step4Valid.success ||
        !step5Valid.success
      ) {
        throw new Error("Please complete all required fields");
      }

      // Prepare form data for submission
      const formData = new FormData();

      // Add applicant details
      Object.entries(applicantDetails).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add representative details
      formData.append(
        "isRepresentative",
        String(representativeDetails.isRepresentative)
      );
      if (representativeDetails.representativeName) {
        formData.append(
          "representativeName",
          representativeDetails.representativeName
        );
      }

      // Add project description
      Object.entries(projectDescription).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add lot ownership type
      if (lotOwnershipType) {
        formData.append("lotOwnershipType", lotOwnershipType);
      }

      // Add long folder
      formData.append("longFolder", String(longFolder));

      // Add documents
      Object.entries(documents).forEach(([key, value]) => {
        if (value.file) {
          formData.append(key, value.file);
        }
      });

      // Submit to API
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new Error(errorData.message ?? "Failed to submit application");
      }

      const result = (await response.json()) as { applicationNo: string };

      // Success
      alert(
        `Application submitted successfully! Application No: ${result.applicationNo}`
      );

      // Reset form or redirect
      window.location.href = "/applicant-user/success";
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    applicantDetails,
    representativeDetails,
    projectDescription,
    lotOwnershipType,
    longFolder,
    documents,
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    validateStep5,
  ]);

  // Check if all required documents are uploaded
  const allRequiredDocumentsUploaded = requiredDocumentFields.every(
    ({ key }) => documents[key].file !== null
  );

  const lotOwnershipDocumentUploaded = lotOwnershipType
    ? (() => {
        const field = lotOwnershipDocumentFields.find(
          (f) => f.type === lotOwnershipType
        );
        return field ? documents[field.key]?.file !== null : false;
      })()
    : false;

  const representativeDocumentsUploaded = !representativeDetails.isRepresentative
    ? true
    : representativeDocumentFields.every(
        ({ key }) => documents[key].file !== null
      );

  const coeDocumentsUploaded = coeDocumentFields.every(
    ({ key }) => documents[key].file !== null
  );

  const allDocumentsUploaded =
    allRequiredDocumentsUploaded &&
    lotOwnershipDocumentUploaded &&
    representativeDocumentsUploaded &&
    coeDocumentsUploaded;

  // Legacy exports for backward compatibility
  const landOwnerDetails = applicantDetails;
  const handleDetailsChange = handleApplicantDetailsChange;

  return {
    // State
    currentStep,
    applicantDetails,
    representativeDetails,
    projectDescription,
    lotOwnershipType,
    documents,
    longFolder,
    isSubmitting,
    submitError,
    fieldErrors,

    // Handlers
    handleApplicantDetailsChange,
    handleRepresentativeDetailsChange,
    handleRepresentativeCheckboxChange,
    handleProjectDescriptionChange,
    handleLongFolderChange,
    handleLotOwnershipTypeSelect,
    handleFileSelect,
    handleFileRemove,
    nextStep,
    prevStep,
    handleSubmit,

    // Computed
    allDocumentsUploaded,
    allRequiredDocumentsUploaded,
    lotOwnershipDocumentUploaded,
    representativeDocumentsUploaded,
    coeDocumentsUploaded,

    // Legacy exports
    landOwnerDetails,
    handleDetailsChange,
  };
}
