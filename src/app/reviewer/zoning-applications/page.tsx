"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

type ApplicationStatus = "SUBMITTED" | "REVIEWING" | "REJECTED" | "APPROVED" | "FOR_EVALUATION";
type FilterStatus = "ALL" | ApplicationStatus;

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

export default function ReviewerZoningApplicationsPage() {
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: applications, isLoading } = api.zoningApplication.getAll.useQuery(
    filter === "ALL" ? undefined : { status: filter }
  );
  const { data: stats } = api.zoningApplication.getStats.useQuery();

  // Filter applications based on search query
  const filteredApplications = applications?.filter((application) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      application.applicantName.toLowerCase().includes(searchLower) ||
      application.applicantEmail.toLowerCase().includes(searchLower) ||
      application.applicationNo.toLowerCase().includes(searchLower) ||
      application.applicantContact.toLowerCase().includes(searchLower)
    );
  });

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case "SUBMITTED":
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "REVIEWING":
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case "APPROVED":
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "REJECTED":
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "FOR_EVALUATION":
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
      <div className="mx-auto max-w-screen-2xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/reviewer" className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Zoning Applications</h1>
                <p className="text-xs font-medium text-slate-500">Manage Applicant Submissions</p>
              </div>
            </Link>
          </div>
          <Link
            href="/reviewer"
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
                  <div className="mt-1 text-sm font-medium text-slate-600">Total</div>
                </div>
                <div className="rounded-lg bg-slate-100 p-3">
                  <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-900">{stats.submitted}</div>
                  <div className="mt-1 text-sm font-medium text-blue-700">Submitted</div>
                </div>
                <div className="rounded-lg bg-blue-200 p-3">
                  <svg className="h-6 w-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-yellow-900">{stats.reviewing}</div>
                  <div className="mt-1 text-sm font-medium text-yellow-700">Reviewing</div>
                </div>
                <div className="rounded-lg bg-yellow-200 p-3">
                  <svg className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-900">{stats.approved}</div>
                  <div className="mt-1 text-sm font-medium text-green-700">Approved</div>
                </div>
                <div className="rounded-lg bg-green-200 p-3">
                  <svg className="h-6 w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-red-900">{stats.rejected}</div>
                  <div className="mt-1 text-sm font-medium text-red-700">Rejected</div>
                </div>
                <div className="rounded-lg bg-red-200 p-3">
                  <svg className="h-6 w-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-purple-900">{stats.forEvaluation}</div>
                  <div className="mt-1 text-sm font-medium text-purple-700">For Evaluation</div>
                </div>
                <div className="rounded-lg bg-purple-200 p-3">
                  <svg className="h-6 w-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Filter Applications</h2>
            <span className="text-sm text-slate-600">
              {filteredApplications?.length ?? 0} result{filteredApplications?.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by applicant name, email, application number, or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === "ALL"
                  ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-500/30"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("SUBMITTED")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === "SUBMITTED"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              Submitted
            </button>
            <button
              onClick={() => setFilter("REVIEWING")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === "REVIEWING"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              Reviewing
            </button>
            <button
              onClick={() => setFilter("APPROVED")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === "APPROVED"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("REJECTED")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === "REJECTED"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilter("FOR_EVALUATION")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === "FOR_EVALUATION"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              For Evaluation
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
              <p className="text-sm font-medium text-slate-600">Loading applications...</p>
            </div>
          ) : filteredApplications && filteredApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Application No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Applicant Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map((application) => {
                    const statusConfig = STATUS_CONFIG[application.status as ApplicationStatus];
                    return (
                      <tr key={application.id} className="group transition-colors hover:bg-slate-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="font-mono text-sm font-semibold text-slate-900">
                            {application.applicationNo}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                              <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {application.applicantName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {application.applicantEmail}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {application.applicantContact}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.color}`}
                          >
                            {getStatusIcon(application.status as ApplicationStatus)}
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                          {new Date(application.submittedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Link
                            href={`/reviewer/zoning-applications/${application.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/30"
                          >
                            Review
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <svg
                  className="h-10 w-10 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">No applications found</h3>
              <p className="text-center text-sm text-slate-600">
                {searchQuery
                  ? "Try adjusting your search or filter criteria"
                  : "There are no applications to review at this time"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
