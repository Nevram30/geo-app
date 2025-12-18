"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

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

const STATUS_FLOW: ApplicationStatus[] = ["SUBMITTED", "REVIEWING", "REJECTED", "APPROVED", "FOR_EVALUATION"];

const ReviewerApplicationDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "">("");
  const [remarks, setRemarks] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const utils = api.useUtils();
  const { data: application, isLoading } = api.zoningApplication.getById.useQuery({ id });

  const updateStatusMutation = api.zoningApplication.updateStatus.useMutation({
    onSuccess: () => {
      void utils.zoningApplication.getById.invalidate({ id });
      void utils.zoningApplication.getAll.invalidate();
      void utils.zoningApplication.getStats.invalidate();
      setSelectedStatus("");
      setRemarks("");
      setIsUpdating(false);
    },
    onError: () => {
      setIsUpdating(false);
    },
  });

  const handleStatusUpdate = () => {
    if (!selectedStatus) return;
    setIsUpdating(true);
    updateStatusMutation.mutate({
      id,
      status: selectedStatus,
      remarks: remarks || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 py-8 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-lg">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
            <p className="text-sm font-medium text-slate-600">Loading application details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 py-8 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-lg">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">Application Not Found</h3>
            <p className="mb-6 text-center text-sm text-slate-600">
              The application you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/reviewer/zoning-applications"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-700"
            >
              Back to Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStatusConfig = STATUS_CONFIG[application.status as ApplicationStatus];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/reviewer/zoning-applications"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Applications
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold ${currentStatusConfig.bgColor} ${currentStatusConfig.borderColor} ${currentStatusConfig.color}`}
          >
            {currentStatusConfig.label}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Application Header */}
            <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Application Review</h1>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="font-mono text-lg font-semibold text-orange-600">
                      {application.applicationNo}
                    </span>
                    <span className="text-sm text-slate-500">
                      Submitted on{" "}
                      {new Date(application.submittedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Applicant Information */}
            <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Applicant Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Full Name</div>
                  <div className="mt-1 font-medium text-slate-900">{application.applicantName}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</div>
                  <div className="mt-1 font-medium text-slate-900">{application.applicantEmail}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Contact Number</div>
                  <div className="mt-1 font-medium text-slate-900">{application.applicantContact}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Address</div>
                  <div className="mt-1 font-medium text-slate-900">{application.applicantAddress}</div>
                </div>
              </div>
            </div>

            {/* Representative Information */}
            {application.isRepresentative && (
              <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Representative Information</h2>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Representative Name</div>
                  <div className="mt-1 font-medium text-slate-900">{application.representativeName ?? "N/A"}</div>
                </div>
              </div>
            )}

            {/* Project Information */}
            <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Project Information</h2>
              <div className="space-y-4">
                {application.projectDescription && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Project Description</div>
                    <div className="mt-2 text-slate-900">{application.projectDescription}</div>
                  </div>
                )}
                {application.projectBoundaries && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Project Boundaries</div>
                    <div className="mt-2 text-slate-900">{application.projectBoundaries}</div>
                  </div>
                )}
                {application.projectObjectives && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Project Objectives</div>
                    <div className="mt-2 text-slate-900">{application.projectObjectives}</div>
                  </div>
                )}
                {application.zoningExceptionReason && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Zoning Exception Reason</div>
                    <div className="mt-2 text-slate-900">{application.zoningExceptionReason}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Lot Ownership */}
            {application.lotOwnershipType && (
              <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Lot Ownership</h2>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Ownership Type</div>
                  <div className="mt-1 font-medium text-slate-900">
                    {application.lotOwnershipType.replace(/_/g, " ")}
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Uploaded Documents</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {application.taxClearanceOriginal && (
                  <a
                    href={application.taxClearanceOriginal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                      <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Tax Clearance (Original)</div>
                      <div className="text-xs text-slate-500">Click to view</div>
                    </div>
                  </a>
                )}
                {application.lotPlan && (
                  <a
                    href={application.lotPlan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                      <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Lot Plan</div>
                      <div className="text-xs text-slate-500">Click to view</div>
                    </div>
                  </a>
                )}
                {application.architecturalPlan && (
                  <a
                    href={application.architecturalPlan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                      <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Architectural Plan</div>
                      <div className="text-xs text-slate-500">Click to view</div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Status Update */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Current Status */}
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Current Status</h3>
                <div
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-bold ${currentStatusConfig.bgColor} ${currentStatusConfig.borderColor} ${currentStatusConfig.color}`}
                >
                  {currentStatusConfig.label}
                </div>

                {/* Previous Remarks */}
                {application.remarks && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <div className="text-xs font-medium text-amber-800">Previous Remarks</div>
                    <p className="mt-1 text-sm text-amber-700">{application.remarks}</p>
                    {application.reviewedByUser && (
                      <p className="mt-2 text-xs text-amber-600">
                        By: {application.reviewedByUser.name}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Update Status */}
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Update Status</h3>

                {/* Status Selection */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Select New Status
                  </label>
                  <div className="space-y-2">
                    {STATUS_FLOW.map((status) => {
                      const config = STATUS_CONFIG[status];
                      const isCurrentStatus = status === application.status;
                      return (
                        <button
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                          disabled={isCurrentStatus}
                          className={`flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                            selectedStatus === status
                              ? `${config.bgColor} ${config.borderColor} ${config.color}`
                              : isCurrentStatus
                              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <span>{config.label}</span>
                          {isCurrentStatus && (
                            <span className="text-xs text-slate-400">(Current)</span>
                          )}
                          {selectedStatus === status && (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Remarks */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Remarks (Optional)
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add any comments or feedback for the applicant..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleStatusUpdate}
                  disabled={!selectedStatus || isUpdating}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    selectedStatus && !isUpdating
                      ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl"
                      : "cursor-not-allowed bg-slate-200 text-slate-400"
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Status
                    </>
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedStatus("REVIEWING");
                      setRemarks("Application is now under review.");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-100"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Start Review
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStatus("APPROVED");
                      setRemarks("Application has been approved.");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStatus("REJECTED");
                      setRemarks("");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStatus("FOR_EVALUATION");
                      setRemarks("Application requires further evaluation.");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Send for Evaluation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerApplicationDetailPage;
