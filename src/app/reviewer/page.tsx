"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export default function ReviewerDashboard() {
  const { data: stats } = api.zoningApplication.getReviewerStats.useQuery();
  const { data: applicationStats } = api.zoningApplication.getStats.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50">

      {/* Main Content */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reviewer Dashboard</h1>
              <p className="text-sm font-medium text-slate-500">Application Review Portal</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Quick Actions</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Review Business Applications */}
            <Link
              href="/reviewer/applications"
              className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-lg transition-all hover:border-slate-300 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-600 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">Business Applications</h4>
                  <p className="mt-1 text-sm text-slate-600">
                    Review business permit applications
                  </p>
                </div>
              </div>
            </Link>

            {/* Review Zoning Applications */}
            <Link
              href="/reviewer/zoning-applications"
              className="group rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-lg transition-all hover:border-orange-300 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">Zoning Applications</h4>
                  <p className="mt-1 text-sm text-slate-600">
                    Review and manage applicant submissions
                  </p>
                  {applicationStats && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {applicationStats.submitted} new
                      </span>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                        {applicationStats.reviewing} reviewing
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="group rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-lg transition-all hover:border-green-300 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">Analytics Dashboard</h4>
                  <p className="mt-1 text-sm text-slate-600">
                    View system statistics and reports
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Your Review Statistics</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-700">Reviewed by Me</p>
                  <p className="mt-1 text-2xl font-bold text-blue-900">{stats?.assignedToMe ?? 0}</p>
                </div>
                <div className="rounded-lg bg-blue-200 p-3">
                  <svg className="h-6 w-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-yellow-700">Pending Review</p>
                  <p className="mt-1 text-2xl font-bold text-yellow-900">{stats?.pendingReview ?? 0}</p>
                </div>
                <div className="rounded-lg bg-yellow-200 p-3">
                  <svg className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-700">Approved by Me</p>
                  <p className="mt-1 text-2xl font-bold text-green-900">{stats?.approvedByMe ?? 0}</p>
                </div>
                <div className="rounded-lg bg-green-200 p-3">
                  <svg className="h-6 w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-red-700">Rejected by Me</p>
                  <p className="mt-1 text-2xl font-bold text-red-900">{stats?.rejectedByMe ?? 0}</p>
                </div>
                <div className="rounded-lg bg-red-200 p-3">
                  <svg className="h-6 w-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Stats Overview */}
        {applicationStats && (
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-bold text-slate-900">All Applications Overview</h3>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Total</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{applicationStats.total}</p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
                <p className="text-xs font-medium text-blue-600">Submitted</p>
                <p className="mt-1 text-xl font-bold text-blue-900">{applicationStats.submitted}</p>
              </div>
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
                <p className="text-xs font-medium text-yellow-600">Reviewing</p>
                <p className="mt-1 text-xl font-bold text-yellow-900">{applicationStats.reviewing}</p>
              </div>
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
                <p className="text-xs font-medium text-green-600">Approved</p>
                <p className="mt-1 text-xl font-bold text-green-900">{applicationStats.approved}</p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
                <p className="text-xs font-medium text-red-600">Rejected</p>
                <p className="mt-1 text-xl font-bold text-red-900">{applicationStats.rejected}</p>
              </div>
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 shadow-sm">
                <p className="text-xs font-medium text-purple-600">For Evaluation</p>
                <p className="mt-1 text-xl font-bold text-purple-900">{applicationStats.forEvaluation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Information Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Reviewer Responsibilities */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Your Responsibilities</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="text-orange-600">&#10003;</span>
                <span>Review and evaluate zoning applications</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-600">&#10003;</span>
                <span>Verify submitted documents and information</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-600">&#10003;</span>
                <span>Check compliance with zoning regulations</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-600">&#10003;</span>
                <span>Provide feedback and recommendations</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-600">&#10003;</span>
                <span>Approve or reject applications based on criteria</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-600">&#10003;</span>
                <span>Maintain accurate review records</span>
              </li>
            </ul>
          </div>

          {/* Status Flow */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Application Status Flow</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">1</span>
                <span className="text-sm font-medium text-slate-700">Submitted - Application received</span>
              </div>
              <div className="ml-4 border-l-2 border-slate-200 pl-6 py-1"></div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-sm font-bold text-yellow-700">2</span>
                <span className="text-sm font-medium text-slate-700">Reviewing - Under assessment</span>
              </div>
              <div className="ml-4 border-l-2 border-slate-200 pl-6 py-1"></div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">3</span>
                <span className="text-sm font-medium text-slate-700">Approved - Application approved</span>
              </div>
              <div className="ml-4 border-l-2 border-slate-200 pl-6 py-1"></div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">!</span>
                <span className="text-sm font-medium text-slate-700">Rejected - Application denied</span>
              </div>
              <div className="ml-4 border-l-2 border-slate-200 pl-6 py-1"></div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">4</span>
                <span className="text-sm font-medium text-slate-700">For Evaluation - Needs further review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Tools */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Review Tools</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/reviewer/zoning-applications"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all hover:border-orange-300 hover:shadow-xl"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition-transform group-hover:scale-110">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900">Zoning Applications</h4>
              <p className="mt-2 text-sm text-slate-600">
                View and manage all zoning applications
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-orange-600">
                View Applications
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              href="/reviewer/applications"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all hover:border-slate-300 hover:shadow-xl"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-transform group-hover:scale-110">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900">Business Applications</h4>
              <p className="mt-2 text-sm text-slate-600">
                View and manage business permit applications
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-slate-600">
                View Applications
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              href="/map"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all hover:border-blue-300 hover:shadow-xl"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900">Interactive Map</h4>
              <p className="mt-2 text-sm text-slate-600">
                View zones and business locations
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                Open Map
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
