"use client";

import React from "react";
import { FormField } from "../components";
import type { ApplicantDetails } from "../schemas/document.schema";

interface ApplicantDetailsStepProps {
  data: ApplicantDetails;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ApplicantDetailsStep: React.FC<ApplicantDetailsStepProps> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Applicant Details</h2>
      <p className="text-sm text-gray-600 mb-6">
        Please provide the applicant&apos;s information below.
      </p>

      <FormField
        label="Full Name"
        name="applicantName"
        value={data.applicantName}
        onChange={onChange}
        error={errors.applicantName}
        placeholder="Enter full name"
        required
      />

      <FormField
        label="Complete Address"
        name="applicantAddress"
        type="textarea"
        value={data.applicantAddress}
        onChange={onChange}
        error={errors.applicantAddress}
        placeholder="Enter complete address"
        required
      />

      <FormField
        label="Contact Number"
        name="applicantContact"
        type="tel"
        value={data.applicantContact}
        onChange={onChange}
        error={errors.applicantContact}
        placeholder="e.g., 09123456789"
        required
      />

      <FormField
        label="Email Address"
        name="applicantEmail"
        type="email"
        value={data.applicantEmail}
        onChange={onChange}
        error={errors.applicantEmail}
        placeholder="Enter email address"
        required
      />
    </div>
  );
};

export default ApplicantDetailsStep;
