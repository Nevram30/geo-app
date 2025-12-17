"use client";

import React from "react";
import { FormField, FileUpload } from "../components";
import {
  representativeDocumentFields,
  type RepresentativeDetails,
  type DocumentFieldKey,
} from "../schemas/document.schema";
import type { DocumentsState } from "../types";

interface RepresentativeInfoStepProps {
  data: RepresentativeDetails;
  documents: DocumentsState;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCheckboxChange: (checked: boolean) => void;
  onFileSelect: (fieldKey: DocumentFieldKey, file: File) => void;
  onFileRemove: (fieldKey: DocumentFieldKey) => void;
}

export const RepresentativeInfoStep: React.FC<RepresentativeInfoStepProps> = ({
  data,
  documents,
  errors,
  onChange,
  onCheckboxChange,
  onFileSelect,
  onFileRemove,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Representative Information
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          If you are submitting this application on behalf of someone else,
          please provide the required representative documents.
        </p>
      </div>

      {/* Representative Toggle */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={data.isRepresentative}
            onChange={(e) => onCheckboxChange(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">
              I am submitting as a representative
            </span>
            <p className="text-xs text-gray-500">
              Check this if you are authorized to submit on behalf of the lot owner
            </p>
          </div>
        </label>
      </div>

      {data.isRepresentative && (
        <>
          {/* Representative Name */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Representative Details
            </h3>
            <FormField
              label="Representative's Full Name"
              name="representativeName"
              value={data.representativeName ?? ""}
              onChange={onChange}
              error={errors.representativeName}
              placeholder="Enter representative's full name"
              required
            />
          </div>

          {/* Representative Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Required Representative Documents
            </h3>
            <p className="text-sm text-gray-600">
              Please upload the following documents for representative
              applications.
            </p>

            <div className="grid gap-4 md:grid-cols-1">
              {representativeDocumentFields.map(({ key, label, description }) => (
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
                  Representative Requirements
                </h4>
                <ul className="mt-1 list-inside list-disc text-sm text-yellow-700 space-y-1">
                  <li>
                    Duly notarized Authorization Letter or Special Power of
                    Attorney (1 original)
                  </li>
                  <li>
                    Government-issued ID of the person being represented (1
                    photocopy)
                  </li>
                  <li>
                    Government-issued ID of the representative (1 photocopy)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {!data.isRepresentative && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Not Applicable
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            This section is only required if you are submitting on behalf of
            someone else. You can proceed to the next step.
          </p>
        </div>
      )}
    </div>
  );
};

export default RepresentativeInfoStep;
