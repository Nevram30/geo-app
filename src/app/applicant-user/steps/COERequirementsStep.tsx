"use client";

import React from "react";
import { FormField, FileUpload } from "../components";
import {
  coeDocumentFields,
  type ProjectDescription,
  type DocumentFieldKey,
} from "../schemas/document.schema";
import type { DocumentsState } from "../types";

interface COERequirementsStepProps {
  data: ProjectDescription;
  documents: DocumentsState;
  longFolder: boolean;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLongFolderChange: (checked: boolean) => void;
  onFileSelect: (fieldKey: DocumentFieldKey, file: File) => void;
  onFileRemove: (fieldKey: DocumentFieldKey) => void;
}

export const COERequirementsStep: React.FC<COERequirementsStepProps> = ({
  data,
  documents,
  longFolder,
  errors,
  onChange,
  onLongFolderChange,
  onFileSelect,
  onFileRemove,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          COE (Certificate of Exception) Requirements
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Mandatory requirements for Certificate of Exception application.
        </p>
      </div>

      {/* Project Description Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Project Description
        </h3>
        <p className="text-sm text-gray-600">
          Provide detailed information about your project as required for the COE
          application.
        </p>

        <FormField
          label="Project Description"
          name="projectDescription"
          type="textarea"
          value={data.projectDescription}
          onChange={onChange}
          error={errors.projectDescription}
          placeholder="Describe the nature of operation or use of the project..."
          required
        />

        <FormField
          label="Project Boundaries"
          name="projectBoundaries"
          type="textarea"
          value={data.projectBoundaries}
          onChange={onChange}
          error={errors.projectBoundaries}
          placeholder="Describe the boundaries of the project area..."
          required
        />

        <FormField
          label="Project Objectives"
          name="projectObjectives"
          type="textarea"
          value={data.projectObjectives}
          onChange={onChange}
          error={errors.projectObjectives}
          placeholder="Describe the objectives to be achieved by the project..."
          required
        />

        <FormField
          label="Reason for Zoning Exception"
          name="zoningExceptionReason"
          type="textarea"
          value={data.zoningExceptionReason}
          onChange={onChange}
          error={errors.zoningExceptionReason}
          placeholder="Explain why the project cannot fulfill its objectives under the Zoning Regulations..."
          required
        />
      </div>

      {/* COE Document Uploads */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Project Description Documents
        </h3>
        <p className="text-sm text-gray-600">
          Upload the formal project description document (1 original and 1
          photocopy required).
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {coeDocumentFields.map(({ key, label, description }) => (
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

      {/* Long Folder Confirmation */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={longFolder}
            onChange={(e) => onLongFolderChange(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">
              Long Folder Prepared
            </span>
            <p className="text-xs text-gray-500">
              Confirm that you have prepared a long folder for your documents
            </p>
          </div>
        </label>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-blue-600"
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
            <h4 className="text-sm font-medium text-blue-800">
              COE Document Requirements
            </h4>
            <p className="mt-1 text-sm text-blue-700">
              The Project Description document should include:
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-blue-700 space-y-1">
              <li>Boundaries of the project</li>
              <li>Nature of operation or use</li>
              <li>Objectives to be achieved by the project</li>
              <li>
                Statement as to why the project cannot fulfill its objectives
                under the Zoning Regulations
              </li>
            </ul>
            <p className="mt-2 text-sm text-blue-700">
              Submit 1 original and 1 photocopy of the project description document.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default COERequirementsStep;
