"use client";

import React from "react";
import { StepIndicator } from "./components";
import { useApplicationForm } from "./hooks";
import {
  ApplicantCorporationStep,
  ProjectInformationStep,
  ZoningNoticeStep,
  SimilarApplicationStep,
  DecisionDeliveryStep,
  ReviewStep,
} from "./steps";

const TOTAL_STEPS = 6;

const ApplicantUserPage: React.FC = () => {
  const {
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
    isReadyToSubmit,
  } = useApplicationForm();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ApplicantCorporationStep
            data={applicantDetails}
            errors={fieldErrors}
            onChange={handleApplicantDetailsChange}
          />
        );
      case 2:
        return (
          <ProjectInformationStep
            data={projectInformation}
            errors={fieldErrors}
            onChange={handleProjectInformationChange}
            onSelectChange={handleProjectInformationSelectChange}
          />
        );
      case 3:
        return (
          <ZoningNoticeStep
            data={zoningNotice}
            errors={fieldErrors}
            onChange={handleZoningNoticeChange}
            onCheckboxChange={handleZoningNoticeCheckboxChange}
          />
        );
      case 4:
        return (
          <SimilarApplicationStep
            data={similarApplication}
            errors={fieldErrors}
            onChange={handleSimilarApplicationChange}
            onCheckboxChange={handleSimilarApplicationCheckboxChange}
          />
        );
      case 5:
        return (
          <DecisionDeliveryStep
            data={decisionDelivery}
            documents={documents}
            errors={fieldErrors}
            onChange={handleDecisionDeliveryChange}
            onSelectChange={handleDecisionDeliverySelectChange}
            onCheckboxChange={handleDecisionDeliveryCheckboxChange}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
          />
        );
      case 6:
        return (
          <ReviewStep
            applicantDetails={applicantDetails}
            projectInformation={projectInformation}
            zoningNotice={zoningNotice}
            similarApplication={similarApplication}
            decisionDelivery={decisionDelivery}
            documents={documents}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Locational Clearance / Zoning Compliance
          </h1>
          <p className="mt-2 text-gray-600">
            ANNEX A - HLURB Memorandum Circular Application Form
          </p>
        </div>

        {/* Main Form Card */}
        <div className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} />

          {/* Form Content */}
          <div className="mt-6">{renderStep()}</div>

          {/* Error Message */}
          {submitError && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="ml-3 text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`rounded-md px-6 py-2.5 text-sm font-medium transition-colors ${
                currentStep === 1
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !isReadyToSubmit}
                className={`rounded-md px-6 py-2.5 text-sm font-medium text-white transition-colors ${
                  isSubmitting || !isReadyToSubmit
                    ? "cursor-not-allowed bg-green-400"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>
            )}
          </div>
        </div>

        {/* HLURB Form Reference */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Form Fields Reference (HLURB ANNEX A)
          </h3>
          <div className="grid gap-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium">1-6.</span>
              <span>Applicant/Corporation/Representative Details</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium">7-8.</span>
              <span>Project Type and Nature</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium">9-10.</span>
              <span>Project Location and Area</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium">11-12.</span>
              <span>Right Over Land and Project Tenure</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium">14.</span>
              <span>Project Cost/Capitalization</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium">15-16.</span>
              <span>Zoning Notice History</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium">17.</span>
              <span>Similar Application History</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium">18-19.</span>
              <span>Decision Delivery Mode and Signature</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            This form follows ANNEX A of HLURB Memorandum Circular for Application for the
            Locational Clearance/Certificate of Zoning Compliance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicantUserPage;
