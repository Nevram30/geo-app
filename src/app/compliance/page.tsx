"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function CompliancePage() {
  const [filter, setFilter] = useState<"ALL" | "COMPLIANT" | "NON_COMPLIANT" | "PENDING">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: businesses, isLoading } = api.business.getAll.useQuery();

  // Filter businesses based on compliance status and search
  const filteredBusinesses = businesses?.filter((business) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      business.businessName.toLowerCase().includes(searchLower) ||
      business.ownerName.toLowerCase().includes(searchLower) ||
      business.applicationNo.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    if (filter === "ALL") return true;
    if (filter === "COMPLIANT") return business.status === "APPROVED";
    if (filter === "NON_COMPLIANT") return business.status === "REJECTED" || business.status === "REQUIRES_REVISION";
    if (filter === "PENDING") return business.status === "PENDING" || business.status === "UNDER_REVIEW";

    return true;
  });

  const stats = {
    total: businesses?.length ?? 0,
    compliant: businesses?.filter((b) => b.status === "APPROVED").length ?? 0,
    nonCompliant: businesses?.filter((b) => b.status === "REJECTED" || b.status === "REQUIRES_REVISION").length ?? 0,
    pending: businesses?.filter((b) => b.status === "PENDING" || b.status === "UNDER_REVIEW").length ?? 0,
  };

  const getComplianceStatus = (status: string) => {
    if (status === "APPROVED") return { label: "Compliant", color: "green" };
    if (status === "REJECTED" || status === "REQUIRES_REVISION") return { label: "Non-Compliant", color: "red" };
    return { label: "Pending Review", color: "yellow" };
  };

  const getComplianceIcon = (status: string) => {
    const compliance = getComplianceStatus(status);
    if (compliance.color === "green") {
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (compliance.color === "red") {
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Professional Header */}
      <header className="border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-3 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">ZoniTrack+</h1>
                <p className="text-xs font-medium text-slate-500">Compliance Check System</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/applications"
              className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Applications
            </Link>
            <Link
              href="/map"
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View Map
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-screen-2xl px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Compliance Check Dashboard</h2>
              <p className="mt-1 text-blue-100">Monitor and verify business application compliance with zoning regulations</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
                <div className="mt-1 text-sm font-medium text-slate-600">Total Applications</div>
              </div>
              <div className="rounded-lg bg-slate-100 p-3">
                <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-900">{stats.compliant}</div>
                <div className="mt-1 text-sm font-medium text-green-700">Compliant</div>
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
                <div className="text-3xl font-bold text-red-900">{stats.nonCompliant}</div>
                <div className="mt-1 text-sm font-medium text-red-700">Non-Compliant</div>
              </div>
              <div className="rounded-lg bg-red-200 p-3">
                <svg className="h-6 w-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-sm transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-900">{stats.pending}</div>
                <div className="mt-1 text-sm font-medium text-yellow-700">Pending Review</div>
              </div>
              <div className="rounded-lg bg-yellow-200 p-3">
                <svg className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Filter by Compliance Status</h2>
            <span className="text-sm text-slate-600">
              {filteredBusinesses?.length ?? 0} result{filteredBusinesses?.length !== 1 ? "s" : ""}
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
                placeholder="Search by business name, owner, or application number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === "ALL"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              All Applications
            </button>
            <button
              onClick={() => setFilter("COMPLIANT")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === "COMPLIANT"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Compliant
            </button>
            <button
              onClick={() => setFilter("NON_COMPLIANT")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === "NON_COMPLIANT"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Non-Compliant
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === "PENDING"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending Review
            </button>
          </div>
        </div>

        {/* Compliance List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-sm font-medium text-slate-600">Loading compliance data...</p>
            </div>
          ) : filteredBusinesses && filteredBusinesses.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredBusinesses.map((business) => {
                const compliance = getComplianceStatus(business.status);
                return (
                  <div
                    key={business.id}
                    className="group p-6 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-1 items-start gap-4">
                        {/* Status Icon */}
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            compliance.color === "green"
                              ? "bg-green-100 text-green-600"
                              : compliance.color === "red"
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {getComplianceIcon(business.status)}
                        </div>

                        {/* Business Info */}
                        <div className="flex-1">
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900">
                                {business.businessName}
                              </h3>
                              <p className="text-sm text-slate-600">
                                Owner: {business.ownerName} • App No: {business.applicationNo}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                                compliance.color === "green"
                                  ? "border-green-200 bg-green-100 text-green-800"
                                  : compliance.color === "red"
                                    ? "border-red-200 bg-red-100 text-red-800"
                                    : "border-yellow-200 bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {compliance.label}
                            </span>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="flex items-center gap-2 text-sm">
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span className="text-slate-700">{business.barangay.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="text-slate-700">{business.category.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-slate-700">
                                {new Date(business.submittedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-slate-700">{business.status.replace("_", " ")}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/applications/${business.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
                      >
                        View Details
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <svg className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">No applications found</h3>
              <p className="text-center text-sm text-slate-600">
                {searchQuery
                  ? "Try adjusting your search or filter criteria"
                  : "No applications match the selected compliance status"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
