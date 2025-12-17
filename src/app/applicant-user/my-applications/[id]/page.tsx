"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { ApplicantNavigation } from "../../components";

type ApplicationStatus = "SUBMITTED" | "REVIEWING" | "REJECTED" | "APPROVED" | "FOR_EVALUATION";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  SUBMITTED: {
    label: "Submitted",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
  REVIEWING: {
    label: "Reviewing",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
  },
  APPROVED: {
    label: "Approved",
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
  },
  FOR_EVALUATION: {
    label: "For Evaluation",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
  },
};

const ApplicationDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  const { data: application, isLoading } = api.zoningApplication.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <ApplicantNavigation />
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-lg">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm font-medium text-gray-600">Loading application details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <ApplicantNavigation />
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-lg">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">Application Not Found</h3>
            <p className="mb-6 text-center text-sm text-gray-600">
              The application you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <Link
              href="/applicant-user/my-applications"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Back to My Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[application.status as ApplicationStatus];

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <ApplicantNavigation />
        </div>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/applicant-user/my-applications"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Applications
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.color}`}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Main Card */}
        <div className="rounded-xl bg-white p-8 shadow-lg">
          {/* Application Header */}
          <div className="mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
            <div className="mt-2 flex items-center gap-4">
              <span className="font-mono text-lg font-semibold text-blue-600">
                {application.applicationNo}
              </span>
              <span className="text-sm text-gray-500">
                Submitted on{" "}
                {new Date(application.submittedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Reviewer Remarks */}
          {application.remarks && (
            <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <div>
                  <div className="font-medium text-amber-800">Reviewer Remarks</div>
                  <p className="mt-1 text-amber-700">{application.remarks}</p>
                  {application.reviewedByUser && (
                    <p className="mt-2 text-sm text-amber-600">
                      Reviewed by: {application.reviewedByUser.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Applicant Information */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Applicant Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Full Name</div>
                <div className="mt-1 font-medium text-gray-900">{application.applicantName}</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Email</div>
                <div className="mt-1 font-medium text-gray-900">{application.applicantEmail}</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Contact Number</div>
                <div className="mt-1 font-medium text-gray-900">{application.applicantContact}</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Address</div>
                <div className="mt-1 font-medium text-gray-900">{application.applicantAddress}</div>
              </div>
            </div>
          </div>

          {/* Representative Information */}
          {application.isRepresentative && (
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Representative Information</h2>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Representative Name</div>
                <div className="mt-1 font-medium text-gray-900">{application.representativeName ?? "N/A"}</div>
              </div>
            </div>
          )}

          {/* Project Information */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Project Information</h2>
            <div className="space-y-4">
              {application.projectDescription && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Project Description</div>
                  <div className="mt-2 text-gray-900">{application.projectDescription}</div>
                </div>
              )}
              {application.projectBoundaries && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Project Boundaries</div>
                  <div className="mt-2 text-gray-900">{application.projectBoundaries}</div>
                </div>
              )}
              {application.projectObjectives && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Project Objectives</div>
                  <div className="mt-2 text-gray-900">{application.projectObjectives}</div>
                </div>
              )}
              {application.zoningExceptionReason && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Zoning Exception Reason</div>
                  <div className="mt-2 text-gray-900">{application.zoningExceptionReason}</div>
                </div>
              )}
            </div>
          </div>

          {/* Lot Ownership */}
          {application.lotOwnershipType && (
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Lot Ownership</h2>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Ownership Type</div>
                <div className="mt-1 font-medium text-gray-900">
                  {application.lotOwnershipType.replace(/_/g, " ")}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Application Submitted</span>
                  <span className="ml-2 text-gray-500">
                    {new Date(application.submittedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              {application.reviewedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                    <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Reviewed</span>
                    <span className="ml-2 text-gray-500">
                      {new Date(application.reviewedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              )}
              {application.approvedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Approved</span>
                    <span className="ml-2 text-gray-500">
                      {new Date(application.approvedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              )}
              {application.rejectedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                    <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Rejected</span>
                    <span className="ml-2 text-gray-500">
                      {new Date(application.rejectedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
