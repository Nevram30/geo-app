"use client";

import React from "react";
import { FormField } from "../components";
import type { SimilarApplication } from "../schemas/document.schema";

interface SimilarApplicationStepProps {
  data: SimilarApplication;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
}

export const SimilarApplicationStep: React.FC<SimilarApplicationStepProps> = ({
  data,
  errors,
  onChange,
  onCheckboxChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Similar Application History</h2>
        <p className="text-sm text-gray-600 mt-1">
          Information about previous similar applications filed with HLURB offices
        </p>
      </div>

      {/* Question 17 */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-700 font-medium mb-4">
          17. In the project applied for the subject of similar application with order offices of the
          Commission Zoning Administrator?
        </p>

        <div className="flex gap-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="hasSimilarApplication"
              checked={data.hasSimilarApplication === true}
              onChange={() => onCheckboxChange("hasSimilarApplication", true)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasSimilarApplication"
              checked={data.hasSimilarApplication === false}
              onChange={() => onCheckboxChange("hasSimilarApplication", false)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">No</span>
          </label>
        </div>
      </div>

      {/* Conditional fields if YES */}
      {data.hasSimilarApplication && (
        <div className="space-y-4 border-l-4 border-blue-500 pl-4 ml-2">
          <h3 className="text-lg font-medium text-gray-800">
            If YES, provide the following information:
          </h3>

          <FormField
            label="a. Other HLURB Office(s) where similar application(s) was/were filed"
            name="similarApplicationOffices"
            type="textarea"
            value={data.similarApplicationOffices ?? ""}
            onChange={onChange}
            error={errors.similarApplicationOffices}
            placeholder="Enter the HLURB office(s) where similar applications were filed"
          />

          <FormField
            label="b. Date(s) filed"
            name="similarApplicationDates"
            value={data.similarApplicationDates ?? ""}
            onChange={onChange}
            error={errors.similarApplicationDates}
            placeholder="Enter date(s) when applications were filed"
          />

          <FormField
            label="c. Action(s) taken by office(s)"
            name="similarApplicationActions"
            type="textarea"
            value={data.similarApplicationActions ?? ""}
            onChange={onChange}
            error={errors.similarApplicationActions}
            placeholder="Describe the action(s) taken by the office(s)"
          />
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Why we ask this</h4>
            <p className="text-sm text-blue-700 mt-1">
              Disclosing previous similar applications helps HLURB process your application more
              efficiently and ensures consistency in decision-making. If you have filed similar
              applications in other HLURB offices, please provide complete and accurate information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarApplicationStep;
