"use client";

import React from "react";
import { FileUpload } from "../components";
import {
  requiredDocumentFields,
  type DocumentFieldKey,
} from "../schemas/document.schema";
import type { DocumentsState } from "../types";

interface DocumentUploadStepProps {
  documents: DocumentsState;
  onFileSelect: (fieldKey: DocumentFieldKey, file: File) => void;
  onFileRemove: (fieldKey: DocumentFieldKey) => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  documents,
  onFileSelect,
  onFileRemove,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Required Documents Upload
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Please upload the following required documents. Accepted formats: JPG,
          PNG, PDF (Max 5MB each).
        </p>
      </div>

      {/* Tax Clearance Section */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Tax Clearance / Real Property Tax Receipt & Bill
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          Upload 1 original and 1 photocopy of the current year&apos;s tax documents.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {requiredDocumentFields
            .filter(
              (field) =>
                field.key === "taxClearanceOriginal" ||
                field.key === "taxClearancePhotocopy"
            )
            .map(({ key, label, description }) => (
              <FileUpload
                key={key}
                label={label}
                description={description}
                fieldKey={key as DocumentFieldKey}
                state={documents[key as DocumentFieldKey]}
                onFileSelect={onFileSelect}
                onFileRemove={onFileRemove}
                required
              />
            ))}
        </div>
      </div>

      {/* Authority to Sign Section */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Authority to Sign / Corporate Secretary&apos;s Affidavit
        </h3>
        <div className="grid gap-4">
          {requiredDocumentFields
            .filter((field) => field.key === "authorityToSign")
            .map(({ key, label, description }) => (
              <FileUpload
                key={key}
                label={label}
                description={description}
                fieldKey={key as DocumentFieldKey}
                state={documents[key as DocumentFieldKey]}
                onFileSelect={onFileSelect}
                onFileRemove={onFileRemove}
                required
              />
            ))}
        </div>
      </div>

      {/* Plans Section */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Plans & Professional Documents
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          Upload the required plans signed and sealed by licensed professionals.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {requiredDocumentFields
            .filter(
              (field) =>
                field.key === "lotPlan" ||
                field.key === "architecturalPlan" ||
                field.key === "professionalTaxReceipt"
            )
            .map(({ key, label, description }) => (
              <FileUpload
                key={key}
                label={label}
                description={description}
                fieldKey={key as DocumentFieldKey}
                state={documents[key as DocumentFieldKey]}
                onFileSelect={onFileSelect}
                onFileRemove={onFileRemove}
                required
              />
            ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">
              Document Requirements
            </h4>
            <ul className="mt-1 list-inside list-disc text-sm text-yellow-700 space-y-1">
              <li>Tax Clearance: 1 original + 1 photocopy (current year)</li>
              <li>Authority to Sign/Corp. Secretary&apos;s Affidavit: 1 photocopy</li>
              <li>Lot Plan: 1 set signed & sealed</li>
              <li>Architectural Plan: 2 sets signed & sealed</li>
              <li>PTR: Valid Professional Tax Receipt</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
