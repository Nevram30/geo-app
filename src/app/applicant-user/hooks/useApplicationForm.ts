"use client";

import { useState, useCallback } from "react";
import type {
  ApplicantDetails,
  ProjectInformation,
  ZoningNotice,
  SimilarApplication,
  DecisionDelivery,
  DocumentFieldKey,
} from "../schemas/document.schema";
import {
  applicantDetailsSchema,
  projectInformationSchema,
  zoningNoticeSchema,
  similarApplicationSchema,
  decisionDeliverySchema,
  fileSchema,
} from "../schemas/document.schema";
import type { DocumentsState, ValidationResult } from "../types";
import {
  initialApplicantDetails,
  initialProjectInformation,
  initialZoningNotice,
  initialSimilarApplication,
  initialDecisionDelivery,
  initialDocumentsState,
  initialFileUploadState,
} from "../types";

const TOTAL_STEPS = 6;

export function useApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicantDetails, setApplicantDetails] = useState<ApplicantDetails>(
    initialApplicantDetails
  );
  const [projectInformation, setProjectInformation] = useState<ProjectInformation>(
    initialProjectInformation
  );
  const [zoningNotice, setZoningNotice] = useState<ZoningNotice>(initialZoningNotice);
  const [similarApplication, setSimilarApplication] = useState<SimilarApplication>(
    initialSimilarApplication
  );
  const [decisionDelivery, setDecisionDelivery] = useState<DecisionDelivery>(
    initialDecisionDelivery
  );
  const [documents, setDocuments] = useState<DocumentsState>(initialDocumentsState);
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

  // Handle project information change
  const handleProjectInformationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProjectInformation((prev) => ({
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

  // Handle project information select change (for radio buttons)
  const handleProjectInformationSelectChange = useCallback(
    (name: string, value: string) => {
      setProjectInformation((prev) => ({
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

  // Handle zoning notice change
  const handleZoningNoticeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setZoningNotice((prev) => ({
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

  // Handle zoning notice checkbox change
  const handleZoningNoticeCheckboxChange = useCallback(
    (name: string, checked: boolean) => {
      setZoningNotice((prev) => ({
        ...prev,
        [name]: checked,
      }));
    },
    []
  );

  // Handle similar application change
  const handleSimilarApplicationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setSimilarApplication((prev) => ({
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

  // Handle similar application checkbox change
  const handleSimilarApplicationCheckboxChange = useCallback(
    (name: string, checked: boolean) => {
      setSimilarApplication((prev) => ({
        ...prev,
        [name]: checked,
      }));
    },
    []
  );

  // Handle decision delivery change
  const handleDecisionDeliveryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setDecisionDelivery((prev) => ({
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

  // Handle decision delivery select change
  const handleDecisionDeliverySelectChange = useCallback(
    (name: string, value: string) => {
      setDecisionDelivery((prev) => ({
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

  // Handle decision delivery checkbox change
  const handleDecisionDeliveryCheckboxChange = useCallback(
    (name: string, checked: boolean) => {
      setDecisionDelivery((prev) => ({
        ...prev,
        [name]: checked,
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

  // Validate step 1 (applicant/corporation details)
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

  // Validate step 2 (project information)
  const validateStep2 = useCallback((): ValidationResult => {
    const result = projectInformationSchema.safeParse(projectInformation);

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
  }, [projectInformation]);

  // Validate step 3 (zoning notice)
  const validateStep3 = useCallback((): ValidationResult => {
    const result = zoningNoticeSchema.safeParse(zoningNotice);

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
  }, [zoningNotice]);

  // Validate step 4 (similar application)
  const validateStep4 = useCallback((): ValidationResult => {
    const result = similarApplicationSchema.safeParse(similarApplication);

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
  }, [similarApplication]);

  // Validate step 5 (decision delivery)
  const validateStep5 = useCallback((): ValidationResult => {
    const errors: Record<string, string> = {};
    let hasErrors = false;

    const result = decisionDeliverySchema.safeParse(decisionDelivery);

    if (!result.success) {
      result.error.errors.forEach((err) => {
        const path = err.path[0];
        if (path && typeof path === "string") {
          errors[path] = err.message;
          hasErrors = true;
        }
      });
    }

    // Check if signature is confirmed
    if (!decisionDelivery.signatureConfirmed) {
      errors.signatureConfirmed = "You must confirm your signature to proceed";
      hasErrors = true;
    }

    // Check mail address if BY_MAIL is selected
    if (decisionDelivery.decisionReleaseMode === "BY_MAIL" && !decisionDelivery.mailAddress?.trim()) {
      errors.mailAddress = "Mail address is required when selecting mail delivery";
      hasErrors = true;
    }

    if (hasErrors) {
      setFieldErrors(errors);
      return { success: false, errors };
    }

    setFieldErrors({});
    return { success: true, errors: {} };
  }, [decisionDelivery]);

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
        if (value) formData.append(key, value);
      });

      // Add project information
      Object.entries(projectInformation).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Add zoning notice
      formData.append("hasZoningNotice", String(zoningNotice.hasZoningNotice));
      if (zoningNotice.hasZoningNotice) {
        Object.entries(zoningNotice).forEach(([key, value]) => {
          if (key !== "hasZoningNotice" && value) {
            formData.append(key, String(value));
          }
        });
      }

      // Add similar application
      formData.append("hasSimilarApplication", String(similarApplication.hasSimilarApplication));
      if (similarApplication.hasSimilarApplication) {
        Object.entries(similarApplication).forEach(([key, value]) => {
          if (key !== "hasSimilarApplication" && value) {
            formData.append(key, String(value));
          }
        });
      }

      // Add decision delivery
      formData.append("decisionReleaseMode", decisionDelivery.decisionReleaseMode);
      if (decisionDelivery.mailAddress) {
        formData.append("mailAddress", decisionDelivery.mailAddress);
      }
      formData.append("signatureConfirmed", String(decisionDelivery.signatureConfirmed));

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
    projectInformation,
    zoningNotice,
    similarApplication,
    decisionDelivery,
    documents,
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    validateStep5,
  ]);

  // Check if ready to submit
  const isReadyToSubmit = decisionDelivery.signatureConfirmed;

  return {
    // State
    currentStep,
    applicantDetails,
    projectInformation,
    zoningNotice,
    similarApplication,
    decisionDelivery,
    documents,
    isSubmitting,
    submitError,
    fieldErrors,

    // Handlers
    handleApplicantDetailsChange,
    handleProjectInformationChange,
    handleProjectInformationSelectChange,
    handleZoningNoticeChange,
    handleZoningNoticeCheckboxChange,
    handleSimilarApplicationChange,
    handleSimilarApplicationCheckboxChange,
    handleDecisionDeliveryChange,
    handleDecisionDeliverySelectChange,
    handleDecisionDeliveryCheckboxChange,
    handleFileSelect,
    handleFileRemove,
    nextStep,
    prevStep,
    handleSubmit,

    // Computed
    isReadyToSubmit,
  };
}
