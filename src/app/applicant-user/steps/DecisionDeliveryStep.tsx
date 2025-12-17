"use client";

import React from "react";
import { FormField, FileUpload } from "../components";
import type { DecisionDelivery, DocumentFieldKey } from "../schemas/document.schema";
import {
  DECISION_RELEASE_MODES,
  DECISION_RELEASE_MODE_LABELS,
  supportingDocumentFields,
} from "../schemas/document.schema";
import type { DocumentsState } from "../types";

interface DecisionDeliveryStepProps {
  data: DecisionDelivery;
  documents: DocumentsState;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
  onFileSelect: (fieldKey: DocumentFieldKey, file: File) => void;
  onFileRemove: (fieldKey: DocumentFieldKey) => void;
}

export const DecisionDeliveryStep: React.FC<DecisionDeliveryStepProps> = ({
  data,
  documents,
  errors,
  onChange,
  onSelectChange,
  onCheckboxChange,
  onFileSelect,
  onFileRemove,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Decision Delivery & Supporting Documents</h2>
        <p className="text-sm text-gray-600 mt-1">
          Select how you want to receive the decision and upload supporting documents
        </p>
      </div>

      {/* Preferred Mode of Release */}
      <div className="border-b border-gray-200 pb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          18. Preferred Mode or Release of Decision <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {DECISION_RELEASE_MODES.map((mode) => (
            <label key={mode} className="flex items-start">
              <input
                type="radio"
                name="decisionReleaseMode"
                value={mode}
                checked={data.decisionReleaseMode === mode}
                onChange={() => onSelectChange("decisionReleaseMode", mode)}
                className="h-4 w-4 mt-0.5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {DECISION_RELEASE_MODE_LABELS[mode]}
              </span>
            </label>
          ))}
        </div>
        {errors.decisionReleaseMode && (
          <p className="mt-1 text-sm text-red-600">{errors.decisionReleaseMode}</p>
        )}

        {/* Mail address if BY_MAIL is selected */}
        {data.decisionReleaseMode === "BY_MAIL" && (
          <div className="mt-4 ml-6">
            <FormField
              label="Mail Address"
              name="mailAddress"
              type="textarea"
              value={data.mailAddress ?? ""}
              onChange={onChange}
              error={errors.mailAddress}
              placeholder="Enter complete mailing address"
              required
            />
          </div>
        )}
      </div>

      {/* Supporting Documents */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Supporting Documents (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload any supporting documents that may help process your application faster.
        </p>

        <div className="space-y-4">
          {supportingDocumentFields.map((field) => (
            <FileUpload
              key={field.key}
              label={field.label}
              description={field.description}
              fieldKey={field.key}
              state={documents[field.key]}
              onFileSelect={onFileSelect}
              onFileRemove={onFileRemove}
            />
          ))}
        </div>
      </div>

      {/* Signature Confirmation */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">19. Signature of the Applicant</h3>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={data.signatureConfirmed}
            onChange={(e) => onCheckboxChange("signatureConfirmed", e.target.checked)}
            className="h-4 w-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            I hereby certify that the information provided in this application is true and correct
            to the best of my knowledge. I understand that any false statement or misrepresentation
            may result in the denial or revocation of my application.
          </span>
        </label>
        {errors.signatureConfirmed && (
          <p className="mt-2 text-sm text-red-600">{errors.signatureConfirmed}</p>
        )}
      </div>

      {/* Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
            <p className="text-sm text-yellow-700 mt-1">
              By confirming above, you are electronically signing this application.
              Please ensure all information provided is accurate before proceeding to the review step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionDeliveryStep;
