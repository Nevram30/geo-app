"use client";

import React from "react";
import { FileUpload } from "../components";
import {
  LOT_OWNERSHIP_TYPES,
  LOT_OWNERSHIP_LABELS,
  lotOwnershipDocumentFields,
  type LotOwnershipType,
  type DocumentFieldKey,
} from "../schemas/document.schema";
import type { DocumentsState } from "../types";

interface LotOwnershipStepProps {
  selectedType: LotOwnershipType | null;
  documents: DocumentsState;
  onTypeSelect: (type: LotOwnershipType) => void;
  onFileSelect: (fieldKey: DocumentFieldKey, file: File) => void;
  onFileRemove: (fieldKey: DocumentFieldKey) => void;
}

export const LotOwnershipStep: React.FC<LotOwnershipStepProps> = ({
  selectedType,
  documents,
  onTypeSelect,
  onFileSelect,
  onFileRemove,
}) => {
  // Get the document field for the selected type
  const getDocumentFieldForType = (type: LotOwnershipType) => {
    return lotOwnershipDocumentFields.find((field) => field.type === type);
  };

  const selectedDocumentField = selectedType
    ? getDocumentFieldForType(selectedType)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Proof of Lot Ownership
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Select the type of proof of lot ownership you will provide. Only one
          document is required.
        </p>
      </div>

      {/* Ownership Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Select Proof Type <span className="text-red-500">*</span>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {LOT_OWNERSHIP_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onTypeSelect(type)}
              className={`relative flex cursor-pointer rounded-lg border p-4 text-left transition-all ${
                selectedType === type
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      selectedType === type
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedType === type && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 12 12"
                      >
                        <circle cx="6" cy="6" r="3" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`ml-3 text-sm font-medium ${
                      selectedType === type ? "text-blue-900" : "text-gray-900"
                    }`}
                  >
                    {LOT_OWNERSHIP_LABELS[type]}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload for Selected Type */}
      {selectedType && selectedDocumentField && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Upload {selectedDocumentField.label}
          </h3>
          <FileUpload
            label={selectedDocumentField.label}
            description={selectedDocumentField.description}
            fieldKey={selectedDocumentField.key as DocumentFieldKey}
            state={documents[selectedDocumentField.key as DocumentFieldKey]}
            onFileSelect={onFileSelect}
            onFileRemove={onFileRemove}
            required
          />
        </div>
      )}

      {/* Helper Text */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h4 className="text-sm font-medium text-gray-700">
          Acceptable Proof of Lot Ownership
        </h4>
        <p className="mt-1 text-xs text-gray-500">
          Choose whichever is applicable to your situation. Each document type
          has specific requirements:
        </p>
        <ul className="mt-2 list-inside list-disc text-xs text-gray-500 space-y-1">
          <li>Transfer Certificate of Title - 1 certified true copy</li>
          <li>Lease Contract - 1 photocopy</li>
          <li>Award Notice - 1 photocopy</li>
          <li>Deed of Sale - 1 photocopy</li>
          <li>Memorandum of Agreement (MOA) - 1 photocopy</li>
          <li>Affidavit of Consent to Construct - notarized document</li>
          <li>Special Power of Attorney (SPA) - 1 photocopy</li>
        </ul>
      </div>
    </div>
  );
};

export default LotOwnershipStep;
