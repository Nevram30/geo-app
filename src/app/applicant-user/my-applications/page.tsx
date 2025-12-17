"use client";

import React from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { ApplicantNavigation } from "../components";

type ApplicationStatus = "SUBMITTED" | "REVIEWING" | "REJECTED" | "APPROVED" | "FOR_EVALUATION";

const STATUS_FLOW: ApplicationStatus[] = ["SUBMITTED", "REVIEWING", "REJECTED", "APPROVED", "FOR_EVALUATION"];

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }> = {
  SUBMITTED: {
    label: "Submitted",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  REVIEWING: {
    label: "Reviewing",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  APPROVED: {
    label: "Approved",
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  FOR_EVALUATION: {
    label: "For Evaluation",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
};

const StatusProgressBar: React.FC<{ currentStatus: ApplicationStatus }> = ({ currentStatus }) => {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  const isRejected = currentStatus === "REJECTED";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STATUS_FLOW.map((status, index) => {
          const config = STATUS_CONFIG[status];
          const isActive = status === currentStatus;
          const isPassed = index < currentIndex && !isRejected;
          const isSkipped = isRejected && status !== "REJECTED" && index > 1;

          return (
            <React.Fragment key={status}>
              {/* Status Node */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isActive
                      ? `${config.bgColor} ${config.borderColor} ${config.color}`
                      : isPassed
                      ? "border-green-500 bg-green-500 text-white"
                      : isSkipped
                      ? "border-gray-200 bg-gray-100 text-gray-300"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {isPassed ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    config.icon
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive ? config.color : isPassed ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {config.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < STATUS_FLOW.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded ${
                    index < currentIndex && !isRejected ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const MyApplicationsPage: React.FC = () => {
  const { data: applications, isLoading } = api.zoningApplication.getMyApplications.useQuery();

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Navigation */}
        <div className="mb-6">
          <ApplicantNavigation />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">Track the status of your submitted applications</p>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-lg">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm font-medium text-gray-600">Loading your applications...</p>
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((application) => {
              const statusConfig = STATUS_CONFIG[application.status as ApplicationStatus];
              return (
                <div
                  key={application.id}
                  className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                >
                  {/* Application Header */}
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-lg font-bold text-gray-900">
                          {application.applicationNo}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.color}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Submitted on{" "}
                        {new Date(application.submittedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Link
                      href={`/applicant-user/my-applications/${application.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      View Details
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Status Progress Bar */}
                  <div className="mb-6 rounded-lg bg-gray-50 p-4">
                    <StatusProgressBar currentStatus={application.status as ApplicationStatus} />
                  </div>

                  {/* Application Details */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Applicant Name
                      </div>
                      <div className="mt-1 font-medium text-gray-900">{application.applicantName}</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Contact
                      </div>
                      <div className="mt-1 font-medium text-gray-900">{application.applicantContact}</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Email
                      </div>
                      <div className="mt-1 font-medium text-gray-900">{application.applicantEmail}</div>
                    </div>
                  </div>

                  {/* Reviewer Remarks */}
                  {application.remarks && (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-amber-800">Reviewer Remarks</div>
                          <p className="mt-1 text-sm text-amber-700">{application.remarks}</p>
                          {application.reviewedByUser && (
                            <p className="mt-2 text-xs text-amber-600">
                              - {application.reviewedByUser.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="mt-4 flex items-center gap-6 border-t border-gray-100 pt-4 text-xs text-gray-500">
                    {application.reviewedAt && (
                      <div className="flex items-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Reviewed: {new Date(application.reviewedAt).toLocaleDateString()}
                      </div>
                    )}
                    {application.approvedAt && (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Approved: {new Date(application.approvedAt).toLocaleDateString()}
                      </div>
                    )}
                    {application.rejectedAt && (
                      <div className="flex items-center gap-1.5 text-red-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Rejected: {new Date(application.rejectedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-lg">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">No Applications Yet</h3>
            <p className="mb-6 text-center text-sm text-gray-600">
              You haven&apos;t submitted any applications yet. Start by creating a new application.
            </p>
            <Link
              href="/applicant-user"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Application
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
