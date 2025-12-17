"use client";

import React from "react";
import { FormField } from "../components";
import type { ZoningNotice } from "../schemas/document.schema";

interface ZoningNoticeStepProps {
  data: ZoningNotice;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
}

export const ZoningNoticeStep: React.FC<ZoningNoticeStepProps> = ({
  data,
  errors,
  onChange,
  onCheckboxChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Zoning Notice History</h2>
        <p className="text-sm text-gray-600 mt-1">
          Information about previous zoning notices from HLURB or its Deputized Zoning Administrator
        </p>
      </div>

      {/* Question 15 */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-700 font-medium mb-4">
          15. Is the project applied for subject to the written notice(s) from this Commission and or its
          Deputized Zoning Administrator to the effect requiring for presentation of the Locational
          Clearance/Certification of Zoning Compliance (CZC) or for the LC/CZC?
        </p>

        <div className="flex gap-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="hasZoningNotice"
              checked={data.hasZoningNotice === true}
              onChange={() => onCheckboxChange("hasZoningNotice", true)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasZoningNotice"
              checked={data.hasZoningNotice === false}
              onChange={() => onCheckboxChange("hasZoningNotice", false)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">No</span>
          </label>
        </div>
      </div>

      {/* Conditional fields if YES */}
      {data.hasZoningNotice && (
        <div className="space-y-4 border-l-4 border-blue-500 pl-4 ml-2">
          <h3 className="text-lg font-medium text-gray-800">
            16. If YES, answer the following:
          </h3>

          <FormField
            label="a. Name of HLURB Officer or Zoning Administrator who issued the notice(s)"
            name="zoningOfficerName"
            value={data.zoningOfficerName ?? ""}
            onChange={onChange}
            error={errors.zoningOfficerName}
            placeholder="Enter officer/administrator name"
          />

          <FormField
            label="b. Date(s) of notice(s)"
            name="zoningNoticeDates"
            value={data.zoningNoticeDates ?? ""}
            onChange={onChange}
            error={errors.zoningNoticeDates}
            placeholder="Enter date(s) of notice(s)"
          />

          <FormField
            label="c. Other requests indicated in the notice(s)"
            name="zoningNoticeOtherRequests"
            type="textarea"
            value={data.zoningNoticeOtherRequests ?? ""}
            onChange={onChange}
            error={errors.zoningNoticeOtherRequests}
            placeholder="Enter any other requests indicated in the notice(s)"
          />
        </div>
      )}

      {/* Info box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Important</h4>
            <p className="text-sm text-yellow-700 mt-1">
              If you have received any written notice from HLURB or a Deputized Zoning Administrator
              regarding your project, please select &quot;Yes&quot; and provide the required details.
              This information helps process your application more efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoningNoticeStep;
