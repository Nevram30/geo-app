"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { api } from "~/trpc/react";

// Dynamically import the map component to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("./MapView"), { ssr: false });

export default function MapPage() {
  const [selectedLayers, setSelectedLayers] = useState({
    zones: true,
    hazards: true,
    businesses: true,
    heatmap: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: businesses } = api.business.getAll.useQuery();
  const { data: zones } = api.zone.getAll.useQuery();
  const { data: hazards } = api.hazard.getAll.useQuery();

  const toggleLayer = (layer: keyof typeof selectedLayers) => {
    setSelectedLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Professional Header */}
      <header className="border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-3 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">ZoniTrack+</h1>
                <p className="text-xs font-medium text-slate-500">Interactive Mapping System</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 md:flex">
              <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium text-slate-700">Santo Tomas, Davao del Norte</span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 sm:px-4 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl"
            >
              <svg className="h-5 w-5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Toggle Button - Floating in bottom-right corner */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-[9999] flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-2xl hover:bg-blue-700 transition-all active:scale-95 border-4 border-white"
            aria-label="Open menu"
          >
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-[9998]"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Professional Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:relative
          z-[9999] lg:z-0
          w-80 sm:w-96
          h-full
          overflow-y-auto
          border-r border-slate-200
          bg-white
          shadow-xl
          transition-transform duration-300 ease-in-out
        `}>
          {/* Sidebar Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Map Controls</h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">Toggle layers to customize your view</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Layer Controls */}
            <div className="space-y-3">
              {/* Zoning Areas Layer */}
              <div className="group rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 transition-all hover:border-blue-300 hover:shadow-md">
                <label className="flex cursor-pointer items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <div className="h-5 w-5 rounded bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm"></div>
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-900">Zoning Areas</span>
                      <span className="text-xs text-slate-500">{zones?.length ?? 0} zones available</span>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedLayers.zones}
                      onChange={() => toggleLayer("zones")}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400"
                    />
                    <svg className="pointer-events-none absolute left-0 top-0 h-5 w-5 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </label>
              </div>

              {/* Hazard Zones Layer */}
              <div className="group rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 transition-all hover:border-red-300 hover:shadow-md">
                <label className="flex cursor-pointer items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                      <div className="h-5 w-5 rounded bg-gradient-to-br from-red-500 to-red-600 shadow-sm"></div>
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-900">Hazard Zones</span>
                      <span className="text-xs text-slate-500">{hazards?.length ?? 0} hazard zones</span>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedLayers.hazards}
                      onChange={() => toggleLayer("hazards")}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white transition-all checked:border-red-600 checked:bg-red-600 hover:border-red-400"
                    />
                    <svg className="pointer-events-none absolute left-0 top-0 h-5 w-5 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </label>
              </div>

              {/* Businesses Layer */}
              <div className="group rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 transition-all hover:border-green-300 hover:shadow-md">
                <label className="flex cursor-pointer items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-sm"></div>
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-900">Businesses</span>
                      <span className="text-xs text-slate-500">{businesses?.length ?? 0} businesses</span>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedLayers.businesses}
                      onChange={() => toggleLayer("businesses")}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white transition-all checked:border-green-600 checked:bg-green-600 hover:border-green-400"
                    />
                    <svg className="pointer-events-none absolute left-0 top-0 h-5 w-5 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </label>
              </div>

              {/* Density Heatmap Layer */}
              <div className="group rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 transition-all hover:border-orange-300 hover:shadow-md">
                <label className="flex cursor-pointer items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100">
                      <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-900">Density Heatmap</span>
                      <span className="text-xs text-slate-500">Business concentration</span>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedLayers.heatmap}
                      onChange={() => toggleLayer("heatmap")}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white transition-all checked:border-orange-600 checked:bg-orange-600 hover:border-orange-400"
                    />
                    <svg className="pointer-events-none absolute left-0 top-0 h-5 w-5 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </label>
              </div>
            </div>

            {/* Official Zoning Legend */}
            <div className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h3 className="text-base font-bold text-slate-900">Official Zoning Map</h3>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-200">
                <div className="mb-3 pb-3 border-b border-slate-300">
                  <p className="text-xs font-semibold text-slate-900">Municipality of Sto. Tomas</p>
                  <p className="text-xs text-slate-600">Province of Davao del Norte</p>
                  <p className="text-xs text-slate-500 mt-1">Scale: 1:45,000</p>
                  <p className="text-xs text-slate-500">Urban Zoning Map 2007-2016</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{backgroundColor: '#FFFF00', border: '1px solid #ccc'}}></div>
                    <span className="text-xs font-medium text-slate-700">Residential Zone (RZ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{backgroundColor: '#F5DEB3', border: '1px solid #ccc'}}></div>
                    <span className="text-xs font-medium text-slate-700">Socialized Housing Zone (SHZ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{backgroundColor: '#DC143C', border: '1px solid #ccc'}}></div>
                    <span className="text-xs font-medium text-slate-700">Commercial Zone (CZ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{backgroundColor: '#4169E1', border: '1px solid #ccc'}}></div>
                    <span className="text-xs font-medium text-slate-700">Institutional Zone (IZ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{backgroundColor: '#9932CC', border: '1px solid #ccc'}}></div>
                    <span className="text-xs font-medium text-slate-700">Medium Industrial Zone (MIZ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{backgroundColor: '#228B22', border: '1px solid #ccc'}}></div>
                    <span className="text-xs font-medium text-slate-700">Agricultural Zone (AZ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{backgroundColor: '#8B008B', border: '1px solid #ccc'}}></div>
                    <span className="text-xs font-medium text-slate-700">Agro-Industrial Zone (AIZ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{backgroundColor: '#7CFC00', border: '1px solid #ccc'}}></div>
                    <span className="text-xs font-medium text-slate-700">Parks & Recreation (PRTZ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{backgroundColor: '#4682B4', border: '1px solid #ccc'}}></div>
                    <span className="text-xs font-medium text-slate-700">Water Zone (WZ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{backgroundColor: '#006400', border: '1px solid #ccc'}}></div>
                    <span className="text-xs font-medium text-slate-700">Forest Zone (FZ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{backgroundColor: '#808080', border: '1px solid #ccc'}}></div>
                    <span className="text-xs font-medium text-slate-700">Other Use Zone (OUZ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{backgroundColor: '#00CED1', border: '1px solid #ccc'}}></div>
                    <span className="text-xs font-medium text-slate-700">Tourist Zone (TZ)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Status Legend */}
            <div className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <h3 className="text-base font-bold text-slate-900">Business Status</h3>
              </div>
              <div className="space-y-2.5 rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-full bg-green-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-slate-700">Approved</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-full bg-yellow-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-slate-700">Pending</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-full bg-blue-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-slate-700">Under Review</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-full bg-red-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-slate-700">Rejected/Revision</span>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-base font-bold text-slate-900">Statistics</h3>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-700">Total Businesses</p>
                      <p className="mt-1 text-2xl font-bold text-blue-900">{businesses?.length ?? 0}</p>
                    </div>
                    <div className="rounded-lg bg-blue-200 p-3">
                      <svg className="h-6 w-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-purple-700">Zoning Areas</p>
                      <p className="mt-1 text-2xl font-bold text-purple-900">{zones?.length ?? 0}</p>
                    </div>
                    <div className="rounded-lg bg-purple-200 p-3">
                      <svg className="h-6 w-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-orange-700">Hazard Zones</p>
                      <p className="mt-1 text-2xl font-bold text-orange-900">{hazards?.length ?? 0}</p>
                    </div>
                    <div className="rounded-lg bg-orange-200 p-3">
                      <svg className="h-6 w-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container with Professional Styling */}
        <div className="relative flex-1">
          <MapView
            businesses={businesses ?? []}
            zones={zones ?? []}
            hazards={hazards ?? []}
            selectedLayers={selectedLayers}
          />
          
          {/* Map Overlay Info */}
          <div className="pointer-events-none absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-end justify-between">
            <div className="pointer-events-auto rounded-xl bg-white/95 px-3 py-2 sm:px-4 sm:py-3 shadow-xl backdrop-blur-sm max-w-full">
              <p className="text-xs font-medium text-slate-600">
                <span className="font-semibold text-slate-900">Tip:</span> <span className="hidden sm:inline">Hover over business markers to see details, click zones for more info</span><span className="sm:hidden">Hover markers for details</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
