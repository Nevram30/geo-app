import Link from "next/link";

export default async function AdminDashboard() {


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Main Content */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Quick Actions</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Review Applications */}
            <Link
              href="/admin/applications"
              className="group rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-lg transition-all hover:border-purple-300 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">Review Applications</h4>
                  <p className="mt-1 text-sm text-slate-600">
                    Approve or reject business permits
                  </p>
                </div>
              </div>
            </Link>

            {/* View Map */}
            <Link
              href="/map"
              className="group rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg transition-all hover:border-blue-300 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">Interactive Map</h4>
                  <p className="mt-1 text-sm text-slate-600">
                    View all zones and businesses
                  </p>
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
                    View system statistics
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-bold text-slate-900">System Overview</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-700">Total Applications</p>
                  <p className="mt-1 text-2xl font-bold text-blue-900">-</p>
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
                  <p className="mt-1 text-2xl font-bold text-yellow-900">-</p>
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
                  <p className="text-xs font-medium text-green-700">Approved</p>
                  <p className="mt-1 text-2xl font-bold text-green-900">-</p>
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
                  <p className="text-xs font-medium text-red-700">Rejected</p>
                  <p className="mt-1 text-2xl font-bold text-red-900">-</p>
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

        {/* Information Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Admin Responsibilities */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Your Responsibilities</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="text-purple-600">✓</span>
                <span>Review and approve/reject business permit applications</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600">✓</span>
                <span>Verify compliance reports from compliance team</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600">✓</span>
                <span>Manage user accounts and permissions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600">✓</span>
                <span>Monitor system performance and statistics</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600">✓</span>
                <span>Generate reports and analytics</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600">✓</span>
                <span>Oversee zoning regulations and updates</span>
              </li>
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  No recent activity to display. Check the applications page to review pending submissions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* System Management */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-bold text-slate-900">System Management</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/admin/users"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all hover:border-indigo-300 hover:shadow-xl"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-transform group-hover:scale-110">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900">User Management</h4>
              <p className="mt-2 text-sm text-slate-600">
                Manage user accounts, roles, and permissions
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-indigo-600">
                Manage Users
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900">System Settings</h4>
              <p className="mt-2 text-sm text-slate-600">
                Configure system parameters and preferences
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900">Reports & Analytics</h4>
              <p className="mt-2 text-sm text-slate-600">
                Generate comprehensive system reports
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
