"use client";

import React from "react";
import type {
  ApplicantDetails,
  ProjectInformation,
  ZoningNotice,
  SimilarApplication,
  DecisionDelivery,
} from "../schemas/document.schema";
import {
  PROJECT_NATURE_LABELS,
  RIGHT_OVER_LAND_LABELS,
  PROJECT_TENURE_LABELS,
  DECISION_RELEASE_MODE_LABELS,
  supportingDocumentFields,
} from "../schemas/document.schema";
import type { DocumentsState } from "../types";

interface ReviewStepProps {
  applicantDetails: ApplicantDetails;
  projectInformation: ProjectInformation;
  zoningNotice: ZoningNotice;
  similarApplication: SimilarApplication;
  decisionDelivery: DecisionDelivery;
  documents: DocumentsState;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  applicantDetails,
  projectInformation,
  zoningNotice,
  similarApplication,
  decisionDelivery,
  documents,
}) => {
  const uploadedDocuments = supportingDocumentFields.filter(
    (field) => documents[field.key]?.file !== null
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Review Your Application</h2>
        <p className="text-sm text-gray-600 mt-1">
          Please review all information before submitting your application for Locational Clearance/Certificate of Zoning Compliance.
        </p>
      </div>

      {/* Applicant/Corporation Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
          Applicant/Corporation Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">1. Name of Applicant</p>
            <p className="font-medium">{applicantDetails.applicantName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">3. Address of Applicant</p>
            <p className="font-medium">{applicantDetails.applicantAddress}</p>
          </div>
          {applicantDetails.corporationName && (
            <>
              <div>
                <p className="text-sm text-gray-500">2. Name of Corporation</p>
                <p className="font-medium">{applicantDetails.corporationName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">4. Address of Corporation</p>
                <p className="font-medium">{applicantDetails.corporationAddress ?? "N/A"}</p>
              </div>
            </>
          )}
          {applicantDetails.representativeName && (
            <>
              <div>
                <p className="text-sm text-gray-500">5. Name of Authorized Representative</p>
                <p className="font-medium">{applicantDetails.representativeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">6. Address of Authorized Representative</p>
                <p className="font-medium">{applicantDetails.representativeAddress ?? "N/A"}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Project Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
          Project Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">7. Project Type</p>
            <p className="font-medium">{projectInformation.projectType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">8. Project Nature</p>
            <p className="font-medium">
              {PROJECT_NATURE_LABELS[projectInformation.projectNature]}
              {projectInformation.projectNature === "OTHER" && projectInformation.projectNatureOther && (
                <span className="text-gray-600"> - {projectInformation.projectNatureOther}</span>
              )}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">9. Project Location</p>
            <p className="font-medium">{projectInformation.projectLocation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">10. Project Area - Lot</p>
            <p className="font-medium">{projectInformation.projectAreaLot} sq.m.</p>
          </div>
          {projectInformation.projectAreaBuilding && (
            <div>
              <p className="text-sm text-gray-500">10. Project Area - Building</p>
              <p className="font-medium">{projectInformation.projectAreaBuilding} sq.m.</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">11. Right Over Land</p>
            <p className="font-medium">
              {RIGHT_OVER_LAND_LABELS[projectInformation.rightOverLand]}
              {projectInformation.rightOverLand === "OTHER" && projectInformation.rightOverLandOther && (
                <span className="text-gray-600"> - {projectInformation.rightOverLandOther}</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">12. Project Tenure</p>
            <p className="font-medium">
              {PROJECT_TENURE_LABELS[projectInformation.projectTenure]}
              {projectInformation.projectTenure === "TEMPORARY" && projectInformation.projectTenureYears && (
                <span className="text-gray-600"> - {projectInformation.projectTenureYears}</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">14. Project Cost (Figure)</p>
            <p className="font-medium">PHP {projectInformation.projectCostFigure}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">14. Project Cost (Words)</p>
            <p className="font-medium">{projectInformation.projectCostWords}</p>
          </div>
        </div>
      </div>

      {/* Zoning Notice History */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
          Zoning Notice History
        </h3>
        <div>
          <p className="text-sm text-gray-500">15. Subject to written notice from HLURB?</p>
          <p className="font-medium">{zoningNotice.hasZoningNotice ? "Yes" : "No"}</p>
        </div>
        {zoningNotice.hasZoningNotice && (
          <div className="mt-4 space-y-3 pl-4 border-l-2 border-blue-200">
            {zoningNotice.zoningOfficerName && (
              <div>
                <p className="text-sm text-gray-500">16a. HLURB Officer/Zoning Administrator</p>
                <p className="font-medium">{zoningNotice.zoningOfficerName}</p>
              </div>
            )}
            {zoningNotice.zoningNoticeDates && (
              <div>
                <p className="text-sm text-gray-500">16b. Date(s) of notice(s)</p>
                <p className="font-medium">{zoningNotice.zoningNoticeDates}</p>
              </div>
            )}
            {zoningNotice.zoningNoticeOtherRequests && (
              <div>
                <p className="text-sm text-gray-500">16c. Other requests</p>
                <p className="font-medium">{zoningNotice.zoningNoticeOtherRequests}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Similar Application History */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
          Similar Application History
        </h3>
        <div>
          <p className="text-sm text-gray-500">17. Similar application filed with other HLURB offices?</p>
          <p className="font-medium">{similarApplication.hasSimilarApplication ? "Yes" : "No"}</p>
        </div>
        {similarApplication.hasSimilarApplication && (
          <div className="mt-4 space-y-3 pl-4 border-l-2 border-blue-200">
            {similarApplication.similarApplicationOffices && (
              <div>
                <p className="text-sm text-gray-500">17a. HLURB Office(s)</p>
                <p className="font-medium">{similarApplication.similarApplicationOffices}</p>
              </div>
            )}
            {similarApplication.similarApplicationDates && (
              <div>
                <p className="text-sm text-gray-500">17b. Date(s) filed</p>
                <p className="font-medium">{similarApplication.similarApplicationDates}</p>
              </div>
            )}
            {similarApplication.similarApplicationActions && (
              <div>
                <p className="text-sm text-gray-500">17c. Action(s) taken</p>
                <p className="font-medium">{similarApplication.similarApplicationActions}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decision Delivery */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
          Decision Delivery
        </h3>
        <div>
          <p className="text-sm text-gray-500">18. Preferred Mode of Release</p>
          <p className="font-medium">
            {DECISION_RELEASE_MODE_LABELS[decisionDelivery.decisionReleaseMode]}
          </p>
        </div>
        {decisionDelivery.decisionReleaseMode === "BY_MAIL" && decisionDelivery.mailAddress && (
          <div className="mt-3">
            <p className="text-sm text-gray-500">Mail Address</p>
            <p className="font-medium">{decisionDelivery.mailAddress}</p>
          </div>
        )}
        <div className="mt-3">
          <p className="text-sm text-gray-500">19. Signature Confirmation</p>
          <p className="font-medium">
            {decisionDelivery.signatureConfirmed ? (
              <span className="text-green-600 flex items-center">
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Confirmed
              </span>
            ) : (
              <span className="text-red-600">Not confirmed</span>
            )}
          </p>
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
          Supporting Documents
        </h3>
        {uploadedDocuments.length > 0 ? (
          <ul className="space-y-2">
            {uploadedDocuments.map((field) => (
              <li key={field.key} className="flex items-center text-sm">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{field.label}</span>
                <span className="text-gray-500 ml-2">
                  ({documents[field.key]?.file?.name})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No supporting documents uploaded</p>
        )}
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
            <p className="text-sm text-yellow-700 mt-1">
              By clicking &quot;Submit Application&quot;, you confirm that all information provided
              is true and correct. False statements may result in denial or revocation of your
              application. This application follows ANNEX A of HLURB Memorandum Circular for
              Locational Clearance/Certificate of Zoning Compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
