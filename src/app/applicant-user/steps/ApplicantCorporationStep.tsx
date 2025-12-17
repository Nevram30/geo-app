"use client";

import React from "react";
import { FormField } from "../components";
import type { ApplicantDetails } from "../schemas/document.schema";

interface ApplicantCorporationStepProps {
  data: ApplicantDetails;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ApplicantCorporationStep: React.FC<ApplicantCorporationStepProps> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Applicant/Corporation Details</h2>
        <p className="text-sm text-gray-600 mt-1">
          Based on HLURB Memorandum Circular - Application for Locational Clearance/Certificate of Zoning Compliance
        </p>
      </div>

      {/* Applicant Information */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Applicant Information</h3>

        <div className="space-y-4">
          <FormField
            label="1. Name of Applicant"
            name="applicantName"
            value={data.applicantName}
            onChange={onChange}
            error={errors.applicantName}
            placeholder="Enter full name of applicant"
            required
          />

          <FormField
            label="3. Address of Applicant"
            name="applicantAddress"
            type="textarea"
            value={data.applicantAddress}
            onChange={onChange}
            error={errors.applicantAddress}
            placeholder="Enter complete address of applicant"
            required
          />
        </div>
      </div>

      {/* Corporation Information */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Corporation Information (if applicable)</h3>

        <div className="space-y-4">
          <FormField
            label="2. Name of Corporation"
            name="corporationName"
            value={data.corporationName ?? ""}
            onChange={onChange}
            error={errors.corporationName}
            placeholder="Enter corporation name (if applicable)"
          />

          <FormField
            label="4. Address of Corporation"
            name="corporationAddress"
            type="textarea"
            value={data.corporationAddress ?? ""}
            onChange={onChange}
            error={errors.corporationAddress}
            placeholder="Enter corporation address (if applicable)"
          />
        </div>
      </div>

      {/* Authorized Representative Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Authorized Representative (if applicable)</h3>

        <div className="space-y-4">
          <FormField
            label="5. Name of Authorized Representative"
            name="representativeName"
            value={data.representativeName ?? ""}
            onChange={onChange}
            error={errors.representativeName}
            placeholder="Enter representative name (if applicable)"
          />

          <FormField
            label="6. Address of Authorized Representative"
            name="representativeAddress"
            type="textarea"
            value={data.representativeAddress ?? ""}
            onChange={onChange}
            error={errors.representativeAddress}
            placeholder="Enter representative address (if applicable)"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Fields 1 and 3 (Applicant Name and Address) are required.
          Corporation and Representative information are only required if applicable to your application.
        </p>
      </div>
    </div>
  );
};

export default ApplicantCorporationStep;
