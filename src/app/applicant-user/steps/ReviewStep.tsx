"use client";

import React from "react";
import type {
  ApplicantDetails,
  RepresentativeDetails,
  ProjectDescription,
  LotOwnershipType,
} from "../schemas/document.schema";
import {
  requiredDocumentFields,
  lotOwnershipDocumentFields,
  representativeDocumentFields,
  coeDocumentFields,
  LOT_OWNERSHIP_LABELS,
} from "../schemas/document.schema";
import type { DocumentsState } from "../types";

interface ReviewStepProps {
  applicantDetails: ApplicantDetails;
  representativeDetails: RepresentativeDetails;
  projectDescription: ProjectDescription;
  lotOwnershipType: LotOwnershipType | null;
  documents: DocumentsState;
  longFolder: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  applicantDetails,
  representativeDetails,
  projectDescription,
  lotOwnershipType,
  documents,
  longFolder,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const DocumentItem = ({
    label,
    file,
  }: {
    label: string;
    file: File | null;
  }) => (
    <div className="flex items-center gap-3 rounded-md border border-gray-100 bg-gray-50 p-3">
      {file ? (
        <>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="truncate text-xs text-gray-500">
              {file.name} ({formatFileSize(file.size)})
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-400">Not applicable</p>
          </div>
        </>
      )}
    </div>
  );

  // Get the selected lot ownership document field
  const selectedLotOwnershipField = lotOwnershipType
    ? lotOwnershipDocumentFields.find((f) => f.type === lotOwnershipType)
    : null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Review Your Application
      </h2>
      <p className="text-sm text-gray-600">
        Please review all information before submitting your application.
      </p>

      {/* Applicant Details Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-4 border-b pb-2 text-lg font-medium text-gray-900">
          Applicant Details
        </h3>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
            <dd className="text-sm text-gray-900">
              {applicantDetails.applicantName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
            <dd className="text-sm text-gray-900">
              {applicantDetails.applicantContact}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email Address</dt>
            <dd className="text-sm text-gray-900">
              {applicantDetails.applicantEmail}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="text-sm text-gray-900">
              {applicantDetails.applicantAddress}
            </dd>
          </div>
        </dl>
      </div>

      {/* Representative Information (if applicable) */}
      {representativeDetails.isRepresentative && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-4 border-b border-blue-200 pb-2 text-lg font-medium text-gray-900">
            Representative Information
          </h3>
          <dl className="grid gap-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Representative Name
              </dt>
              <dd className="text-sm text-gray-900">
                {representativeDetails.representativeName}
              </dd>
            </div>
          </dl>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {representativeDocumentFields.map(({ key, label }) => (
              <DocumentItem
                key={key}
                label={label}
                file={documents[key]?.file}
              />
            ))}
          </div>
        </div>
      )}

      {/* Proof of Lot Ownership */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-4 border-b pb-2 text-lg font-medium text-gray-900">
          Proof of Lot Ownership
        </h3>
        <div className="mb-4">
          <dt className="text-sm font-medium text-gray-500">Selected Type</dt>
          <dd className="text-sm text-gray-900">
            {lotOwnershipType
              ? LOT_OWNERSHIP_LABELS[lotOwnershipType]
              : "Not selected"}
          </dd>
        </div>
        {selectedLotOwnershipField && (
          <DocumentItem
            label={selectedLotOwnershipField.label}
            file={documents[selectedLotOwnershipField.key]?.file}
          />
        )}
      </div>

      {/* Required Documents Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-4 border-b pb-2 text-lg font-medium text-gray-900">
          Required Documents
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {requiredDocumentFields.map(({ key, label }) => (
            <DocumentItem key={key} label={label} file={documents[key]?.file} />
          ))}
        </div>
      </div>

      {/* COE Requirements Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-4 border-b pb-2 text-lg font-medium text-gray-900">
          COE Requirements
        </h3>
        <dl className="mb-4 grid gap-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Project Description
            </dt>
            <dd className="text-sm text-gray-900">
              {projectDescription.projectDescription || "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Project Boundaries
            </dt>
            <dd className="text-sm text-gray-900">
              {projectDescription.projectBoundaries || "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Project Objectives
            </dt>
            <dd className="text-sm text-gray-900">
              {projectDescription.projectObjectives || "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Reason for Zoning Exception
            </dt>
            <dd className="text-sm text-gray-900">
              {projectDescription.zoningExceptionReason || "Not provided"}
            </dd>
          </div>
        </dl>
        <div className="grid gap-3 sm:grid-cols-2">
          {coeDocumentFields.map(({ key, label }) => (
            <DocumentItem key={key} label={label} file={documents[key]?.file} />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Long Folder:</span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              longFolder
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {longFolder ? "Prepared" : "Not prepared"}
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex gap-3">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">
              Important Notice
            </h4>
            <p className="mt-1 text-sm text-yellow-700">
              By submitting this application, you confirm that all information
              provided is accurate and the uploaded documents are authentic. False
              information may result in rejection of your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
