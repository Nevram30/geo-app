"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

// Google Maps API Key - for testing purposes
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

// Google Maps types for dynamically loaded script
interface LatLng {
  lat: number;
  lng: number;
}

interface GoogleMap {
  setCenter: (latlng: LatLng) => void;
}

interface GoogleMapsApi {
  Map: new (element: HTMLElement, options: { center: LatLng; zoom: number; mapTypeId: string }) => GoogleMap;
  Marker: new (options: { position: LatLng; map: GoogleMap; title: string }) => unknown;
}

interface GoogleMapsWindow extends Window {
  google?: {
    maps: GoogleMapsApi;
  };
}
declare const window: GoogleMapsWindow;

type ApplicationStatus = "SUBMITTED" | "REVIEWING" | "REJECTED" | "APPROVED" | "FOR_EVALUATION";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  SUBMITTED: {
    label: "Submitted",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
  },
  REVIEWING: {
    label: "Reviewing",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
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

const STATUS_FLOW: ApplicationStatus[] = ["SUBMITTED", "REVIEWING", "FOR_EVALUATION", "APPROVED", "REJECTED"];

// Helper function to format lot ownership type
const formatLotOwnershipType = (type: string | null | undefined): string => {
  if (!type) return "";
  const typeMap: Record<string, string> = {
    TRANSFER_CERTIFICATE_OF_TITLE: "OWNED (Transfer Certificate of Title)",
    LEASE_CONTRACT: "LEASED (Lease Contract)",
    AWARD_NOTICE: "AWARDED (Award Notice)",
    DEED_OF_SALE: "OWNED (Deed of Sale)",
    MEMORANDUM_OF_AGREEMENT: "MOA (Memorandum of Agreement)",
    AFFIDAVIT_OF_CONSENT: "CONSENT (Affidavit of Consent)",
    SPECIAL_POWER_OF_ATTORNEY: "SPA (Special Power of Attorney)",
  };
  return typeMap[type] ?? type.replace(/_/g, " ");
};

export default function ComplianceApplicationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "">("");
  const [remarks, setRemarks] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Evaluation form state
  const [evaluationData, setEvaluationData] = useState({
    // Project Information
    projectType: "",
    classification: "",
    siteZoningClass: "",
    lotArea: "",
    buildingFloorArea: "",
    buildingMaterials: "",
    // Site Inspection
    dateOfInspection: "",
    projectStatus: "proposed" as "proposed" | "completed" | "operational" | "percentCompleted" | "others",
    percentCompleted: "",
    // Existing Land Uses
    existingLandUses: {
      residential: false,
      commercial: false,
      agricultural: false,
      institutional: false,
      industrial: false,
      others: false,
    },
    // Abutting Lot Boundaries
    boundaryNorth: "",
    boundaryEast: "",
    boundarySouth: "",
    boundaryWest: "",
    // Agricultural Crops
    cropTypes: "",
    tenancyStatus: "notTenanted" as "tenancy" | "notTenanted",
    // Land Uses within radius
    landUses100m: {
      residential: false,
      commercial: false,
      institutional: false,
      industrial: false,
      agricultural: false,
    },
    landUses500m: {
      residential: false,
      commercial: false,
      institutional: false,
      industrial: false,
      agricultural: false,
    },
    othersSpecify: "",
    // Section D: Sketch of Project Location
    sitePhotos: [] as string[],
    // Section E: As Per Plan Presented
    asPerPlanPresented: "",
    // Section F: Legal Bases & Recommended Decision
    legalBases: {
      clupzo: false,
      munOrdinance2006011: false,
      munOrdinance2006012: false,
      others: false,
      othersText: "",
    },
    findingsAndEvaluation: "",
    recommendedDecision: "",
    // Section G: Remarks
    remarksSection: "",
    // Section H: Signatures
    preparedByName: "",
    preparedByTitle: "",
    preparedByDate: "",
    notedByName: "",
    notedByTitle: "",
    notedByDate: "",
    orNumber: "",
    amountPaid: "",
    paymentDate: "",
  });

  // Camera and Map refs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 7.5321, lng: 125.8046 }); // Default: Santo Tomas, Davao del Norte

  // Handle camera capture
  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setEvaluationData((prev) => ({
            ...prev,
            sitePhotos: [...prev.sitePhotos, result],
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Remove photo
  const removePhoto = (index: number) => {
    setEvaluationData((prev) => ({
      ...prev,
      sitePhotos: prev.sitePhotos.filter((_, i) => i !== index),
    }));
  };

  // Load Google Maps
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || mapLoaded) return;

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, [mapLoaded]);

  // Initialize map when loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 15,
      mapTypeId: "hybrid",
    });

    new window.google.maps.Marker({
      position: mapCenter,
      map,
      title: "Project Location",
    });
  }, [mapLoaded, mapCenter]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-lg">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm font-medium text-slate-600">Loading application details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4">
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
              href="/compliance/applications"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Back to Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStatusConfig = STATUS_CONFIG[application.status as ApplicationStatus];
  const isForEvaluation = application.status === "FOR_EVALUATION";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/compliance/applications"
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
          {/* Main Content - Project Evaluation Report Form */}
          <div className="lg:col-span-2">
            {/* Report Header */}
            <div className="mb-6 rounded-xl bg-white shadow-lg overflow-hidden">
              {/* Government Header */}
              <div className="bg-gradient-to-r from-blue-700 to-blue-800 px-6 py-4 text-center text-white">
                <div className="text-sm font-medium">Republic of the Philippines</div>
                <div className="text-sm">Province of Davao del Norte</div>
                <div className="text-base font-bold">MUNICIPALITY OF SANTO TOMAS</div>
                <div className="mt-1 text-xs bg-blue-600 inline-block px-3 py-1 rounded">
                  OFFICE OF THE MUNICIPAL PLANNING AND DEVELOPMENT COORDINATOR
                </div>
              </div>

              {/* Report Title */}
              <div className="px-6 py-4 text-center border-b border-slate-200">
                <h1 className="text-xl font-bold text-slate-900">PROJECT EVALUATION REPORT</h1>
                <p className="text-sm text-slate-600">(ON ZONING)</p>
                <p className="mt-2 text-sm text-blue-600 font-mono font-semibold">
                  Application No: {application.applicationNo}
                </p>
              </div>
            </div>

            {/* Section A: Applicant's Information */}
            <div className="mb-6 rounded-xl bg-white shadow-lg overflow-hidden">
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">A. APPLICANT&apos;S INFORMATION</h2>
              </div>
              <div className="p-6">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 w-1/2">
                        Name of Applicant (Last, First, Middle)
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 w-1/2">
                        Name of Corporation
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-900">
                        {application.applicantName}
                      </td>
                      <td className="border border-slate-300 px-3 py-3 text-sm text-slate-500 italic">
                        {application.isRepresentative ? application.representativeName : "N/A"}
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50">
                        Address/Telephone of Applicant
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50">
                        Address/Telephone of Corporation
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-3 text-sm text-slate-900">
                        <div className="font-semibold">{application.applicantAddress}</div>
                        <div className="text-slate-600 mt-1">Tel: {application.applicantContact}</div>
                        <div className="text-slate-600">Email: {application.applicantEmail}</div>
                      </td>
                      <td className="border border-slate-300 px-3 py-3 text-sm text-slate-500 italic">
                        N/A
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section B: Project Information */}
            <div className="mb-6 rounded-xl bg-white shadow-lg overflow-hidden">
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">B. PROJECT INFORMATION</h2>
              </div>
              <div className="p-6">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 w-1/2">
                        Name/Type
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 w-1/2">
                        Classification
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2">
                        <input
                          type="text"
                          value={(evaluationData.projectType || application.projectDescription) ?? ""}
                          onChange={(e) => setEvaluationData({ ...evaluationData, projectType: e.target.value })}
                          placeholder="e.g., TWO-STOREY RESIDENTIAL BUILDING"
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="border border-slate-300 px-3 py-2">
                        <input
                          type="text"
                          value={evaluationData.classification}
                          onChange={(e) => setEvaluationData({ ...evaluationData, classification: e.target.value })}
                          placeholder="e.g., RESIDENTIAL"
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50" colSpan={2}>
                        Site Location
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-900" colSpan={2}>
                        {application.applicantAddress}
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 w-1/2">
                        Site/Zoning Class
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 w-1/2">
                        Right Over Land
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2">
                        <input
                          type="text"
                          value={evaluationData.siteZoningClass}
                          onChange={(e) => setEvaluationData({ ...evaluationData, siteZoningClass: e.target.value })}
                          placeholder="e.g., AGRICULTURAL ZONE"
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-900">
                        {formatLotOwnershipType(application.lotOwnershipType)}
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50">
                        LOT Area (Sq.m.)
                      </td>
                      <td className="border border-slate-300 px-3 py-2" rowSpan={2}>
                        <div className="text-xs text-slate-500 mb-2">Details/Notes:</div>
                        <textarea
                          rows={3}
                          placeholder="Additional details about land ownership..."
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                        />
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2">
                        <input
                          type="text"
                          value={evaluationData.lotArea}
                          onChange={(e) => setEvaluationData({ ...evaluationData, lotArea: e.target.value })}
                          placeholder="e.g., 15,455.00"
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50">
                        Bldg. Floor Area (Sq.m.)
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50">
                        Others (Building Materials)
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2">
                        <input
                          type="text"
                          value={evaluationData.buildingFloorArea}
                          onChange={(e) => setEvaluationData({ ...evaluationData, buildingFloorArea: e.target.value })}
                          placeholder="e.g., 526.37"
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="border border-slate-300 px-3 py-2">
                        <input
                          type="text"
                          value={evaluationData.buildingMaterials}
                          onChange={(e) => setEvaluationData({ ...evaluationData, buildingMaterials: e.target.value })}
                          placeholder="e.g., BLDG. IS MADE OF STEEL & CONCRETE"
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section C: Site Inspection Findings */}
            <div className="mb-6 rounded-xl bg-white shadow-lg overflow-hidden">
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">C. SITE INSPECTION FINDINGS</h2>
              </div>
              <div className="p-6">
                <table className="w-full border-collapse">
                  <tbody>
                    {/* Date of Inspection & Existing Land Uses Header */}
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 w-1/2">
                        Date of Inspection
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 w-1/2">
                        Existing land uses within lot boundaries of project site
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2">
                        <input
                          type="date"
                          value={evaluationData.dateOfInspection}
                          onChange={(e) => setEvaluationData({ ...evaluationData, dateOfInspection: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="border border-slate-300 px-3 py-2" rowSpan={2}>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={evaluationData.existingLandUses.residential}
                              onChange={(e) => setEvaluationData({
                                ...evaluationData,
                                existingLandUses: { ...evaluationData.existingLandUses, residential: e.target.checked }
                              })}
                              className="rounded border-slate-300"
                            />
                            <span>Residential</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={evaluationData.existingLandUses.institutional}
                              onChange={(e) => setEvaluationData({
                                ...evaluationData,
                                existingLandUses: { ...evaluationData.existingLandUses, institutional: e.target.checked }
                              })}
                              className="rounded border-slate-300"
                            />
                            <span>Institutional</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={evaluationData.existingLandUses.commercial}
                              onChange={(e) => setEvaluationData({
                                ...evaluationData,
                                existingLandUses: { ...evaluationData.existingLandUses, commercial: e.target.checked }
                              })}
                              className="rounded border-slate-300"
                            />
                            <span>Commercial</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={evaluationData.existingLandUses.industrial}
                              onChange={(e) => setEvaluationData({
                                ...evaluationData,
                                existingLandUses: { ...evaluationData.existingLandUses, industrial: e.target.checked }
                              })}
                              className="rounded border-slate-300"
                            />
                            <span>Industrial</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={evaluationData.existingLandUses.agricultural}
                              onChange={(e) => setEvaluationData({
                                ...evaluationData,
                                existingLandUses: { ...evaluationData.existingLandUses, agricultural: e.target.checked }
                              })}
                              className="rounded border-slate-300"
                            />
                            <span>Agricultural</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={evaluationData.existingLandUses.others}
                              onChange={(e) => setEvaluationData({
                                ...evaluationData,
                                existingLandUses: { ...evaluationData.existingLandUses, others: e.target.checked }
                              })}
                              className="rounded border-slate-300"
                            />
                            <span>Others</span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50">
                        Project Status as of Inspection Date
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2">
                        <div className="space-y-2 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="projectStatus"
                              checked={evaluationData.projectStatus === "proposed"}
                              onChange={() => setEvaluationData({ ...evaluationData, projectStatus: "proposed" })}
                              className="border-slate-300"
                            />
                            <span>Proposed</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="projectStatus"
                              checked={evaluationData.projectStatus === "completed"}
                              onChange={() => setEvaluationData({ ...evaluationData, projectStatus: "completed" })}
                              className="border-slate-300"
                            />
                            <span>Completed</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="projectStatus"
                              checked={evaluationData.projectStatus === "operational"}
                              onChange={() => setEvaluationData({ ...evaluationData, projectStatus: "operational" })}
                              className="border-slate-300"
                            />
                            <span>Operational</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="projectStatus"
                              checked={evaluationData.projectStatus === "percentCompleted"}
                              onChange={() => setEvaluationData({ ...evaluationData, projectStatus: "percentCompleted" })}
                              className="border-slate-300"
                            />
                            <input
                              type="text"
                              value={evaluationData.percentCompleted}
                              onChange={(e) => setEvaluationData({ ...evaluationData, percentCompleted: e.target.value })}
                              placeholder="___%"
                              className="w-16 px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 outline-none"
                            />
                            <span>Completed</span>
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="projectStatus"
                              checked={evaluationData.projectStatus === "others"}
                              onChange={() => setEvaluationData({ ...evaluationData, projectStatus: "others" })}
                              className="border-slate-300"
                            />
                            <span>Others</span>
                          </label>
                        </div>
                      </td>
                      <td className="border border-slate-300 px-3 py-2">
                        <div className="text-xs font-medium text-slate-600 mb-2">In case of Agricultural - Specify Crops:</div>
                        <input
                          type="text"
                          value={evaluationData.cropTypes}
                          onChange={(e) => setEvaluationData({ ...evaluationData, cropTypes: e.target.value })}
                          placeholder="e.g., NONE or specify crops"
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 outline-none"
                        />
                        <div className="text-xs font-medium text-slate-600 mt-3 mb-2">Tenancy Status:</div>
                        <div className="flex gap-4 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="tenancyStatus"
                              checked={evaluationData.tenancyStatus === "tenancy"}
                              onChange={() => setEvaluationData({ ...evaluationData, tenancyStatus: "tenancy" })}
                              className="border-slate-300"
                            />
                            <span>Tenancy</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="tenancyStatus"
                              checked={evaluationData.tenancyStatus === "notTenanted"}
                              onChange={() => setEvaluationData({ ...evaluationData, tenancyStatus: "notTenanted" })}
                              className="border-slate-300"
                            />
                            <span>Not Tenanted</span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    {/* Abutting Lot Boundaries */}
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50" colSpan={2}>
                        Abutting Lot Boundaries of the Project
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2" colSpan={2}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-slate-600">North:</label>
                            <input
                              type="text"
                              value={evaluationData.boundaryNorth}
                              onChange={(e) => setEvaluationData({ ...evaluationData, boundaryNorth: e.target.value })}
                              placeholder="e.g., 02 (LOT 1041-B)"
                              className="w-full mt-1 px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600">East:</label>
                            <input
                              type="text"
                              value={evaluationData.boundaryEast}
                              onChange={(e) => setEvaluationData({ ...evaluationData, boundaryEast: e.target.value })}
                              placeholder="e.g., 12 (LOT 1042-E)"
                              className="w-full mt-1 px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600">South:</label>
                            <input
                              type="text"
                              value={evaluationData.boundarySouth}
                              onChange={(e) => setEvaluationData({ ...evaluationData, boundarySouth: e.target.value })}
                              placeholder="e.g., 42 (LOT 1042-G/ FARM ROAD)"
                              className="w-full mt-1 px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600">West:</label>
                            <input
                              type="text"
                              value={evaluationData.boundaryWest}
                              onChange={(e) => setEvaluationData({ ...evaluationData, boundaryWest: e.target.value })}
                              placeholder="e.g., 15 (LOT 1042-C)"
                              className="w-full mt-1 px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 outline-none"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    {/* Existing Land Uses within radius */}
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50" colSpan={2}>
                        Existing Land Uses (within radius)
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2" colSpan={2}>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="text-xs font-medium text-slate-600 mb-2">Within 100m Radius:</div>
                            <div className="space-y-1">
                              {(["residential", "commercial", "institutional", "industrial", "agricultural"] as const).map((use) => (
                                <label key={use} className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={evaluationData.landUses100m[use]}
                                    onChange={(e) => setEvaluationData({
                                      ...evaluationData,
                                      landUses100m: { ...evaluationData.landUses100m, [use]: e.target.checked }
                                    })}
                                    className="rounded border-slate-300"
                                  />
                                  <span className="capitalize">{use}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-slate-600 mb-2">Within 500m Radius:</div>
                            <div className="space-y-1">
                              {(["residential", "commercial", "institutional", "industrial", "agricultural"] as const).map((use) => (
                                <label key={use} className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={evaluationData.landUses500m[use]}
                                    onChange={(e) => setEvaluationData({
                                      ...evaluationData,
                                      landUses500m: { ...evaluationData.landUses500m, [use]: e.target.checked }
                                    })}
                                    className="rounded border-slate-300"
                                  />
                                  <span className="capitalize">{use}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {/* Others Specify */}
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50" colSpan={2}>
                        Others (Pls. Specify)
                      </td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="border border-slate-300 px-3 py-2" colSpan={2}>
                        <input
                          type="text"
                          value={evaluationData.othersSpecify}
                          onChange={(e) => setEvaluationData({ ...evaluationData, othersSpecify: e.target.value })}
                          placeholder="e.g., WITHIN AGRICULTURAL ZONE"
                          className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 outline-none"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section D: Sketch of Project Location & Significant Findings */}
            <div className="mb-6 rounded-xl bg-white shadow-lg overflow-hidden">
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">D. SKETCH OF PROJECT LOCATION & SIGNIFICANT FINDINGS</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Sketch Project Location (Camera) */}
                  <div className="border border-slate-300 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Sketch Project Location</h3>

                    {/* Camera Input */}
                    <input
                      type="file"
                      ref={cameraInputRef}
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="hidden"
                    />

                    {/* Photo Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {evaluationData.sitePhotos.map((photo, index) => (
                        <div key={index} className="relative group h-32">
                          <Image
                            src={photo}
                            alt={`Site photo ${index + 1}`}
                            fill
                            className="object-cover rounded-lg border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Capture Button */}
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Take Photo</span>
                    </button>

                    <p className="text-xs text-slate-500 mt-2 text-center">
                      Click to open camera and capture site photos
                    </p>
                  </div>

                  {/* Right: Significant Findings (Google Maps) */}
                  <div className="border border-slate-300 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Significant Findings - Geo Mapping</h3>

                    {/* Map Container */}
                    <div
                      ref={mapRef}
                      className="w-full h-64 bg-slate-200 rounded-lg border border-slate-300 flex items-center justify-center"
                    >
                      {!GOOGLE_MAPS_API_KEY ? (
                        <div className="text-center p-4">
                          <svg className="h-12 w-12 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          <p className="text-sm text-slate-500">Google Maps API Key Required</p>
                          <p className="text-xs text-slate-400 mt-1">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env</p>
                        </div>
                      ) : !mapLoaded ? (
                        <div className="flex items-center gap-2 text-slate-500">
                          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Loading map...</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Map Controls */}
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coordinates (lat, lng)"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        onChange={(e) => {
                          const coords = e.target.value.split(",").map((c) => parseFloat(c.trim()));
                          if (coords.length === 2 && !isNaN(coords[0]!) && !isNaN(coords[1]!)) {
                            setMapCenter({ lat: coords[0]!, lng: coords[1]! });
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition((position) => {
                              setMapCenter({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                              });
                            });
                          }
                        }}
                        className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                        title="Get current location"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section E: As Per Plan Presented/Per Actual Inspection */}
            <div className="mb-6 rounded-xl bg-white shadow-lg overflow-hidden">
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">E. AS PER PLAN PRESENTED/Per Actual Inspection</h2>
              </div>
              <div className="p-6">
                <textarea
                  value={evaluationData.asPerPlanPresented}
                  onChange={(e) => setEvaluationData({ ...evaluationData, asPerPlanPresented: e.target.value })}
                  rows={4}
                  placeholder="Enter details of plan presented versus actual inspection findings..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            {/* Section F: Legal Bases Recommended Decision */}
            <div className="mb-6 rounded-xl bg-white shadow-lg overflow-hidden">
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">F. LEGAL BASES RECOMMENDED DECISION</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Legal Bases */}
                  <div className="border border-slate-300 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">LEGAL BASES:</h3>
                    <div className="space-y-3">
                      <label className="flex items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={evaluationData.legalBases.clupzo}
                          onChange={(e) => setEvaluationData({
                            ...evaluationData,
                            legalBases: { ...evaluationData.legalBases, clupzo: e.target.checked }
                          })}
                          className="mt-1 rounded border-slate-300"
                        />
                        <span>CLUP/ZO</span>
                      </label>
                      <label className="flex items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={evaluationData.legalBases.munOrdinance2006011}
                          onChange={(e) => setEvaluationData({
                            ...evaluationData,
                            legalBases: { ...evaluationData.legalBases, munOrdinance2006011: e.target.checked }
                          })}
                          className="mt-1 rounded border-slate-300"
                        />
                        <span>Mun. Ordinance No. 2006-011, Series of 2006; SP Res. No. 174, Series of 2007</span>
                      </label>
                      <label className="flex items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={evaluationData.legalBases.munOrdinance2006012}
                          onChange={(e) => setEvaluationData({
                            ...evaluationData,
                            legalBases: { ...evaluationData.legalBases, munOrdinance2006012: e.target.checked }
                          })}
                          className="mt-1 rounded border-slate-300"
                        />
                        <span>Mun. Ordinance No. 2006-012, Series of 2006; SP Res. No. 175, Series of 2007</span>
                      </label>
                      <div className="flex items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={evaluationData.legalBases.others}
                          onChange={(e) => setEvaluationData({
                            ...evaluationData,
                            legalBases: { ...evaluationData.legalBases, others: e.target.checked }
                          })}
                          className="mt-1 rounded border-slate-300"
                        />
                        <div className="flex-1">
                          <span>Others:</span>
                          <input
                            type="text"
                            value={evaluationData.legalBases.othersText}
                            onChange={(e) => setEvaluationData({
                              ...evaluationData,
                              legalBases: { ...evaluationData.legalBases, othersText: e.target.value }
                            })}
                            placeholder="Specify other legal bases..."
                            className="w-full mt-1 px-2 py-1 text-sm border border-slate-200 rounded focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <label className="text-sm font-semibold text-slate-700">Recommended Decision:</label>
                      <input
                        type="text"
                        value={evaluationData.recommendedDecision}
                        onChange={(e) => setEvaluationData({ ...evaluationData, recommendedDecision: e.target.value })}
                        placeholder="e.g., LOCATIONAL CLEARANCE - GRANTED"
                        className="w-full mt-2 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-blue-500 outline-none font-semibold"
                      />
                    </div>
                  </div>

                  {/* Findings and Evaluation */}
                  <div className="border border-slate-300 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Findings and Evaluation:</h3>
                    <textarea
                      value={evaluationData.findingsAndEvaluation}
                      onChange={(e) => setEvaluationData({ ...evaluationData, findingsAndEvaluation: e.target.value })}
                      rows={10}
                      placeholder="• CONSTRUCTION OF RESIDENTIAL BUILDING DID NOT START YET DURING INSPECTION&#10;• WITHIN AGRICULTURAL ZONE&#10;• WITHIN IDLE AGRICULTURAL LOT&#10;• WITHIN PROPERTY LINE&#10;• MORE THAN 3 METERS SETBACK FROM BARANGAY ROAD"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section G: Remarks */}
            <div className="mb-6 rounded-xl bg-white shadow-lg overflow-hidden">
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">G. REMARKS</h2>
              </div>
              <div className="p-6">
                <textarea
                  value={evaluationData.remarksSection}
                  onChange={(e) => setEvaluationData({ ...evaluationData, remarksSection: e.target.value })}
                  rows={3}
                  placeholder="1. PROPONENT SHOULD MAINTAIN PROPERTY LINE&#10;2. Additional remarks..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            {/* Section H: Signatures */}
            <div className="mb-6 rounded-xl bg-white shadow-lg overflow-hidden">
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">H. SIGNATURES</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Prepared By */}
                  <div className="border border-slate-300 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Prepared by:</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600">Name:</label>
                        <input
                          type="text"
                          value={evaluationData.preparedByName}
                          onChange={(e) => setEvaluationData({ ...evaluationData, preparedByName: e.target.value })}
                          placeholder="e.g., ROBE THOR T. KIAMCO"
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">Title/Position:</label>
                        <input
                          type="text"
                          value={evaluationData.preparedByTitle}
                          onChange={(e) => setEvaluationData({ ...evaluationData, preparedByTitle: e.target.value })}
                          placeholder="e.g., Statistician I"
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">Date:</label>
                        <input
                          type="date"
                          value={evaluationData.preparedByDate}
                          onChange={(e) => setEvaluationData({ ...evaluationData, preparedByDate: e.target.value })}
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Noted By */}
                  <div className="border border-slate-300 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Noted by:</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600">Name:</label>
                        <input
                          type="text"
                          value={evaluationData.notedByName}
                          onChange={(e) => setEvaluationData({ ...evaluationData, notedByName: e.target.value })}
                          placeholder="e.g., CONCORDIA T. ALCOS, LPT, EnP, MEnvP"
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">Title/Position:</label>
                        <input
                          type="text"
                          value={evaluationData.notedByTitle}
                          onChange={(e) => setEvaluationData({ ...evaluationData, notedByTitle: e.target.value })}
                          placeholder="e.g., MGDH-1/MPDC"
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">Date:</label>
                        <input
                          type="date"
                          value={evaluationData.notedByDate}
                          onChange={(e) => setEvaluationData({ ...evaluationData, notedByDate: e.target.value })}
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="mt-6 border border-slate-300 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Payment Details:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-600">Paid under O.R.:</label>
                      <input
                        type="text"
                        value={evaluationData.orNumber}
                        onChange={(e) => setEvaluationData({ ...evaluationData, orNumber: e.target.value })}
                        placeholder="e.g., 3678819"
                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600">Amount paid:</label>
                      <input
                        type="text"
                        value={evaluationData.amountPaid}
                        onChange={(e) => setEvaluationData({ ...evaluationData, amountPaid: e.target.value })}
                        placeholder="e.g., P 10,744.00"
                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600">Date:</label>
                      <input
                        type="date"
                        value={evaluationData.paymentDate}
                        onChange={(e) => setEvaluationData({ ...evaluationData, paymentDate: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Documents Section */}
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Tax Clearance (Original)</div>
                      <div className="text-xs text-slate-500">Click to view</div>
                    </div>
                  </a>
                )}
                {application.taxClearancePhotocopy && (
                  <a
                    href={application.taxClearancePhotocopy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Tax Clearance (Photocopy)</div>
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Architectural Plan</div>
                      <div className="text-xs text-slate-500">Click to view</div>
                    </div>
                  </a>
                )}
                {application.vicinityMap && (
                  <a
                    href={application.vicinityMap}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Vicinity Map</div>
                      <div className="text-xs text-slate-500">Click to view</div>
                    </div>
                  </a>
                )}
                {application.siteDevelopmentPlan && (
                  <a
                    href={application.siteDevelopmentPlan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Site Development Plan</div>
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

              {/* Update Status - Only show if FOR_EVALUATION */}
              {isForEvaluation && (
                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">Evaluate Application</h3>

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
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleStatusUpdate}
                    disabled={!selectedStatus || isUpdating}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      selectedStatus && !isUpdating
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl"
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
              )}

              {/* Quick Actions - Only show if FOR_EVALUATION */}
              {isForEvaluation && (
                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedStatus("REVIEWING");
                        setRemarks("Application is now under review by compliance officer.");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Mark as Reviewing
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStatus("APPROVED");
                        setRemarks("Application has been approved after compliance evaluation.");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Approve Application
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
                      Reject Application
                    </button>
                  </div>
                </div>
              )}

              {/* Status Not For Evaluation Message */}
              {!isForEvaluation && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">Evaluation Not Available</h4>
                      <p className="mt-1 text-xs text-slate-500">
                        This application is currently in <strong>{currentStatusConfig.label}</strong> status.
                        Only applications with <strong>For Evaluation</strong> status can be evaluated.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      {(application.reviewedAt ?? application.approvedAt ?? application.rejectedAt) && (
                        <div className="h-full w-0.5 bg-slate-200"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-semibold text-slate-900">Application Submitted</p>
                      <p className="text-xs text-slate-500">{new Date(application.submittedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {application.reviewedAt && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        {(application.approvedAt ?? application.rejectedAt) && (
                          <div className="h-full w-0.5 bg-slate-200"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-semibold text-slate-900">Last Reviewed</p>
                        <p className="text-xs text-slate-500">{new Date(application.reviewedAt).toLocaleString()}</p>
                        {application.reviewedByUser && (
                          <p className="text-xs text-slate-400">By: {application.reviewedByUser.name}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {application.approvedAt && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Application Approved</p>
                        <p className="text-xs text-slate-500">{new Date(application.approvedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {application.rejectedAt && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Application Rejected</p>
                        <p className="text-xs text-slate-500">{new Date(application.rejectedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Help */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                <div className="flex gap-3">
                  <svg className="h-6 w-6 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">Need Assistance?</h4>
                    <p className="mt-1 text-xs text-blue-700">
                      Contact MPDO at{" "}
                      <a href="tel:+639123456789" className="font-semibold underline">
                        +63 912 345 6789
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
