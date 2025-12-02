import Link from "next/link";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Professional Header */}
      <header className="border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">ZoniTrack+</h1>
              <p className="text-xs font-medium text-slate-500">Geo-Intelligent Decision Support System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{session.user.name}</span>
                </div>
                <Link
                  href="/api/auth/signout"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
                >
                  Sign out
                </Link>
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTQtNHYyaDJ2LTJoLTJ6bTAtNGgtMnYyaDJ2LTJ6bS00LTRoLTJ2Mmgydi0yem00IDB2Mmgydi0yaC0yem0tNCA0aC0ydjJoMnYtMnptMC00di0yaDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative mx-auto max-w-screen-2xl px-6 py-20">
          <div className="text-center text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="text-sm font-medium">Santo Tomas, Davao del Norte</span>
            </div>
            
            <h2 className="mb-4 text-5xl font-bold leading-tight">
              Municipal Planning &<br />Development Office
            </h2>
            
            <p className="mx-auto mb-8 max-w-3xl text-lg text-blue-100">
              A Mobile-Enabled Geo-Intelligent Decision Support System for Location Assessment and
              Zoning Compliance with Land Use Suitability Analysis
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/applications/new"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-700 shadow-xl transition-all hover:bg-blue-50 hover:shadow-2xl"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Application
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Explore Map
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="relative">
          <svg className="w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(248, 250, 252)"/>
          </svg>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="mx-auto max-w-screen-2xl px-6 -mt-16 relative z-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/applications"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 transition-transform group-hover:scale-110">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">Applications</h3>
            <p className="text-sm text-slate-600">
              Submit and manage business permit applications
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-green-600">
              View Applications
              <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/map"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 transition-transform group-hover:scale-110">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">Interactive Map</h3>
            <p className="text-sm text-slate-600">
              Explore zones, hazards, and business locations
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-purple-600">
              Open Map
              <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/compliance"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-transform group-hover:scale-110">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">Compliance Check</h3>
            <p className="text-sm text-slate-600">
              Automated zoning and hazard compliance validation
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-orange-600">
              Check Compliance
              <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">Dashboard</h3>
            <p className="text-sm text-slate-600">
              View analytics, statistics, and spatial insights
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
              View Dashboard
              <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="mx-auto max-w-screen-2xl px-6 py-20">
        <div className="mb-12 text-center">
          <h3 className="mb-3 text-3xl font-bold text-slate-900">Powerful Features</h3>
          <p className="text-lg text-slate-600">Advanced tools for intelligent decision-making</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-bold text-slate-900">Automated Zoning</h4>
            <p className="text-sm text-slate-600">
              GIS-based validation of business locations against land use classifications
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-bold text-slate-900">Hazard Detection</h4>
            <p className="text-sm text-slate-600">
              Automatically detect and flag applications in flood-prone or hazard areas
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-bold text-slate-900">Spatial Dashboards</h4>
            <p className="text-sm text-slate-600">
              Monitor and analyze business application trends across all barangays
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-bold text-slate-900">Clustering Analysis</h4>
            <p className="text-sm text-slate-600">
              Identify high-density business areas and support zoning adjustments
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-screen-2xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-blue-600">100%</div>
              <div className="text-sm font-medium text-slate-600">Automated Compliance</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-green-600">24/7</div>
              <div className="text-sm font-medium text-slate-600">System Availability</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-purple-600">Real-time</div>
              <div className="text-sm font-medium text-slate-600">GIS Analysis</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-orange-600">Smart</div>
              <div className="text-sm font-medium text-slate-600">Decision Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-screen-2xl px-6 py-20">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-12 text-center text-white shadow-2xl">
          <h3 className="mb-4 text-3xl font-bold">Ready to Get Started?</h3>
          <p className="mb-8 text-lg text-blue-100">
            Submit your business application today and experience streamlined compliance checking
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/applications/new"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-700 shadow-xl transition-all hover:bg-blue-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Application
            </Link>
            <Link
              href="/applications"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-8 py-3 text-base font-semibold backdrop-blur-sm transition-all hover:bg-white/20"
            >
              View All Applications
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-screen-2xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-900">ZoniTrack+</div>
                  <div className="text-xs text-slate-600">MPDO Santo Tomas</div>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Geo-Intelligent Decision Support System for Location Assessment and Zoning Compliance
              </p>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold text-slate-900">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/applications" className="hover:text-blue-600">Applications</Link></li>
                <li><Link href="/map" className="hover:text-blue-600">Interactive Map</Link></li>
                <li><Link href="/compliance" className="hover:text-blue-600">Compliance Check</Link></li>
                <li><Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold text-slate-900">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Santo Tomas, Davao del Norte
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  mpdo@santotomas.gov.ph
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>© 2025 Municipal Planning and Development Office - Santo Tomas, Davao del Norte</p>
            <p className="mt-1">All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
