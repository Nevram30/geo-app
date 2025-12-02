"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function DashboardPage() {
  const [trendPeriod, setTrendPeriod] = useState<"week" | "month" | "quarter" | "year">("month");

  const { data: summary, isLoading: summaryLoading } = api.analytics.getDashboardSummary.useQuery();
  const { data: trends } = api.analytics.getTrends.useQuery({ period: trendPeriod });
  const { data: clustering } = api.analytics.getClustering.useQuery();

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
                <p className="text-xs font-medium text-slate-500">Analytics Dashboard</p>
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
        {/* Overview Statistics */}
        {summaryLoading ? (
          <div className="mb-8 flex items-center justify-center p-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : summary ? (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-slate-900">{summary.overview.total}</div>
                    <div className="mt-1 text-sm font-medium text-slate-600">Total Applications</div>
                  </div>
                  <div className="rounded-lg bg-slate-100 p-3">
                    <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-900">{summary.overview.approved}</div>
                    <div className="mt-1 text-sm font-medium text-green-700">Approved</div>
                  </div>
                  <div className="rounded-lg bg-green-200 p-3">
                    <svg className="h-6 w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-yellow-900">{summary.overview.pending}</div>
                    <div className="mt-1 text-sm font-medium text-yellow-700">Pending</div>
                  </div>
                  <div className="rounded-lg bg-yellow-200 p-3">
                    <svg className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-900">{summary.overview.underReview}</div>
                    <div className="mt-1 text-sm font-medium text-blue-700">Under Review</div>
                  </div>
                  <div className="rounded-lg bg-blue-200 p-3">
                    <svg className="h-6 w-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-purple-900">{summary.overview.approvalRate.toFixed(1)}%</div>
                    <div className="mt-1 text-sm font-medium text-purple-700">Approval Rate</div>
                  </div>
                  <div className="rounded-lg bg-purple-200 p-3">
                    <svg className="h-6 w-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
              {/* Barangay Distribution */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-900">Applications by Barangay</h3>
                <div className="space-y-3">
                  {summary.barangayDistribution.slice(0, 8).map((item, index) => {
                    const maxCount = summary.barangayDistribution[0]?.count || 1;
                    const percentage = (item.count / maxCount) * 100;
                    return (
                      <div key={item.name}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{item.name}</span>
                          <span className="font-semibold text-slate-900">{item.count}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Distribution */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-900">Applications by Category</h3>
                <div className="space-y-3">
                  {summary.categoryDistribution.slice(0, 8).map((item, index) => {
                    const maxCount = summary.categoryDistribution[0]?.count || 1;
                    const percentage = (item.count / maxCount) * 100;
                    const colors = [
                      "from-green-500 to-green-600",
                      "from-purple-500 to-purple-600",
                      "from-orange-500 to-orange-600",
                      "from-pink-500 to-pink-600",
                      "from-indigo-500 to-indigo-600",
                      "from-teal-500 to-teal-600",
                      "from-red-500 to-red-600",
                      "from-yellow-500 to-yellow-600",
                    ];
                    return (
                      <div key={item.name}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{item.name}</span>
                          <span className="font-semibold text-slate-900">{item.count}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r transition-all ${colors[index % colors.length]}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Clustering Analysis */}
            {clustering && clustering.clusters.length > 0 && (
              <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Spatial Clustering Analysis</h3>
                  <Link
                    href="/map"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View on Map →
                  </Link>
                </div>
                <div className="mb-4 grid gap-4 sm:grid-cols-4">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="text-2xl font-bold text-blue-900">{clustering.statistics.totalClusters}</div>
                    <div className="text-sm text-blue-700">Clusters Found</div>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <div className="text-2xl font-bold text-green-900">{clustering.statistics.clusteredBusinesses}</div>
                    <div className="text-sm text-green-700">Businesses in Clusters</div>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4">
                    <div className="text-2xl font-bold text-purple-900">{clustering.statistics.averageClusterSize}</div>
                    <div className="text-sm text-purple-700">Avg Cluster Size</div>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-4">
                    <div className="text-2xl font-bold text-orange-900">
                      {((clustering.statistics.clusteredBusinesses / clustering.statistics.totalBusinesses) * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-orange-700">Clustering Rate</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {clustering.clusters.slice(0, 5).map((cluster) => (
                    <div key={cluster.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900">{cluster.id}</h4>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {cluster.businessCount} businesses
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Barangays:</span> {cluster.barangays.join(", ")}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        <span className="font-medium">Categories:</span> {cluster.categories.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Applications */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Recent Applications</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="pb-3 text-left text-xs font-bold uppercase text-slate-700">App No</th>
                      <th className="pb-3 text-left text-xs font-bold uppercase text-slate-700">Business Name</th>
                      <th className="pb-3 text-left text-xs font-bold uppercase text-slate-700">Barangay</th>
                      <th className="pb-3 text-left text-xs font-bold uppercase text-slate-700">Category</th>
                      <th className="pb-3 text-left text-xs font-bold uppercase text-slate-700">Status</th>
                      <th className="pb-3 text-left text-xs font-bold uppercase text-slate-700">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {summary.recentApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="py-3 text-sm font-mono font-semibold text-slate-900">{app.applicationNo}</td>
                        <td className="py-3 text-sm font-medium text-slate-900">{app.businessName}</td>
                        <td className="py-3 text-sm text-slate-600">{app.barangay}</td>
                        <td className="py-3 text-sm text-slate-600">{app.category}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              app.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : app.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : app.status === "UNDER_REVIEW"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {app.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-slate-600">
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
