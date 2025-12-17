"use client";

import React from "react";
import { FormField } from "../components";
import type { ProjectInformation } from "../schemas/document.schema";
import {
  PROJECT_NATURE_TYPES,
  PROJECT_NATURE_LABELS,
  RIGHT_OVER_LAND_TYPES,
  RIGHT_OVER_LAND_LABELS,
  PROJECT_TENURE_TYPES,
  PROJECT_TENURE_LABELS,
} from "../schemas/document.schema";

interface ProjectInformationStepProps {
  data: ProjectInformation;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export const ProjectInformationStep: React.FC<ProjectInformationStepProps> = ({
  data,
  errors,
  onChange,
  onSelectChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Project Information</h2>
        <p className="text-sm text-gray-600 mt-1">
          Provide details about your project as required by the HLURB form
        </p>
      </div>

      {/* Project Type */}
      <div className="border-b border-gray-200 pb-6">
        <FormField
          label="7. Project Type"
          name="projectType"
          value={data.projectType}
          onChange={onChange}
          error={errors.projectType}
          placeholder="e.g., Residential, Commercial, Industrial, Mixed-Use"
          required
        />
      </div>

      {/* Project Nature */}
      <div className="border-b border-gray-200 pb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          8. Project Nature <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {PROJECT_NATURE_TYPES.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="projectNature"
                value={type}
                checked={data.projectNature === type}
                onChange={() => onSelectChange("projectNature", type)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {PROJECT_NATURE_LABELS[type]}
              </span>
            </label>
          ))}
        </div>
        {data.projectNature === "OTHER" && (
          <div className="mt-3">
            <FormField
              label="Please specify"
              name="projectNatureOther"
              value={data.projectNatureOther ?? ""}
              onChange={onChange}
              error={errors.projectNatureOther}
              placeholder="Specify project nature"
            />
          </div>
        )}
        {errors.projectNature && (
          <p className="mt-1 text-sm text-red-600">{errors.projectNature}</p>
        )}
      </div>

      {/* Project Location */}
      <div className="border-b border-gray-200 pb-6">
        <FormField
          label="9. Project Location"
          name="projectLocation"
          type="textarea"
          value={data.projectLocation}
          onChange={onChange}
          error={errors.projectLocation}
          placeholder="No. of Street, Brgy., Municipality, Province"
          required
        />
      </div>

      {/* Project Area */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">10. Project Area (in square meters)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Lot Area"
            name="projectAreaLot"
            value={data.projectAreaLot}
            onChange={onChange}
            error={errors.projectAreaLot}
            placeholder="e.g., 500 sq.m."
            required
          />
          <FormField
            label="Building/Improvement Area"
            name="projectAreaBuilding"
            value={data.projectAreaBuilding ?? ""}
            onChange={onChange}
            error={errors.projectAreaBuilding}
            placeholder="e.g., 200 sq.m."
          />
        </div>
      </div>

      {/* Right Over Land */}
      <div className="border-b border-gray-200 pb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          11. Right Over Land <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {RIGHT_OVER_LAND_TYPES.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="rightOverLand"
                value={type}
                checked={data.rightOverLand === type}
                onChange={() => onSelectChange("rightOverLand", type)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {RIGHT_OVER_LAND_LABELS[type]}
              </span>
            </label>
          ))}
        </div>
        {data.rightOverLand === "OTHER" && (
          <div className="mt-3">
            <FormField
              label="Please specify"
              name="rightOverLandOther"
              value={data.rightOverLandOther ?? ""}
              onChange={onChange}
              error={errors.rightOverLandOther}
              placeholder="Specify right over land"
            />
          </div>
        )}
        {errors.rightOverLand && (
          <p className="mt-1 text-sm text-red-600">{errors.rightOverLand}</p>
        )}
      </div>

      {/* Project Tenure */}
      <div className="border-b border-gray-200 pb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          12. Project Tenure <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {PROJECT_TENURE_TYPES.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="projectTenure"
                value={type}
                checked={data.projectTenure === type}
                onChange={() => onSelectChange("projectTenure", type)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {PROJECT_TENURE_LABELS[type]}
              </span>
            </label>
          ))}
        </div>
        {data.projectTenure === "TEMPORARY" && (
          <div className="mt-3">
            <FormField
              label="Specify number of years"
              name="projectTenureYears"
              value={data.projectTenureYears ?? ""}
              onChange={onChange}
              error={errors.projectTenureYears}
              placeholder="e.g., 5 years"
            />
          </div>
        )}
        {errors.projectTenure && (
          <p className="mt-1 text-sm text-red-600">{errors.projectTenure}</p>
        )}
      </div>

      {/* Project Cost/Capitalization */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">14. Project Cost/Capitalization (in Pesos)</h3>
        <div className="space-y-4">
          <FormField
            label="Amount in Figures"
            name="projectCostFigure"
            value={data.projectCostFigure}
            onChange={onChange}
            error={errors.projectCostFigure}
            placeholder="e.g., 5,000,000.00"
            required
          />
          <FormField
            label="Amount in Words"
            name="projectCostWords"
            type="textarea"
            value={data.projectCostWords}
            onChange={onChange}
            error={errors.projectCostWords}
            placeholder="e.g., Five Million Pesos Only"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectInformationStep;
