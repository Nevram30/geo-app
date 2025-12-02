"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type Step = 1 | 2 | 3 | 4;

export default function NewApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    ownerContact: "",
    ownerEmail: "",
    address: "",
    barangayId: "",
    latitude: "",
    longitude: "",
    categoryId: "",
    description: "",
  });

  const { data: barangays } = api.barangay.getAll.useQuery();
  const { data: categories } = api.category.getAll.useQuery();
  
  const createBusiness = api.business.create.useMutation({
    onSuccess: (data) => {
      setCurrentStep(4);
      setTimeout(() => {
        router.push(`/applications/${data.id}`);
      }, 2000);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      alert("Please provide valid coordinates");
      return;
    }

    createBusiness.mutate({
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      ownerContact: formData.ownerContact || undefined,
      ownerEmail: formData.ownerEmail || undefined,
      address: formData.address,
      barangayId: formData.barangayId,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      categoryId: formData.categoryId,
      description: formData.description || undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        (error) => {
          alert("Error getting location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        return !!(formData.businessName && formData.categoryId);
      case 2:
        return !!formData.ownerName;
      case 3:
        return !!(formData.address && formData.barangayId && formData.latitude && formData.longitude);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4) as Step);
    } else {
      alert("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const steps = [
    { number: 1, title: "Business Info", icon: "🏢" },
    { number: 2, title: "Owner Details", icon: "👤" },
    { number: 3, title: "Location", icon: "📍" },
    { number: 4, title: "Review & Submit", icon: "✓" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Professional Header */}
      <header className="border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">ZoniTrack+</h1>
                <p className="text-xs font-medium text-slate-500">Business Permit Application</p>
              </div>
            </Link>
            <Link
              href="/applications"
              className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Applications
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-all ${
                      currentStep >= step.number
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white text-slate-400 shadow-md"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-semibold ${
                        currentStep >= step.number ? "text-blue-600" : "text-slate-400"
                      }`}
                    >
                      Step {step.number}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.number ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="mx-4 h-1 flex-1">
                    <div
                      className={`h-full rounded-full transition-all ${
                        currentStep > step.number
                          ? "bg-gradient-to-r from-blue-600 to-blue-700"
                          : "bg-slate-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Business Information</h2>
                  <p className="mt-1 text-sm text-slate-600">Tell us about your business</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-semibold text-slate-700">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Enter your business name"
                      className="mt-2 block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-semibold text-slate-700">
                      Business Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      required
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="mt-2 block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="">Select a category</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
                      Business Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your business activities..."
                      className="mt-2 block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Owner Information */}
            {currentStep === 2 && (
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Owner Information</h2>
                  <p className="mt-1 text-sm text-slate-600">Provide the business owner&apos;s details</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="ownerName" className="block text-sm font-semibold text-slate-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      required
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Enter owner&apos;s full name"
                      className="mt-2 block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="ownerContact" className="block text-sm font-semibold text-slate-700">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        id="ownerContact"
                        name="ownerContact"
                        value={formData.ownerContact}
                        onChange={handleChange}
                        placeholder="+63 912 345 6789"
                        className="mt-2 block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label htmlFor="ownerEmail" className="block text-sm font-semibold text-slate-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="ownerEmail"
                        name="ownerEmail"
                        value={formData.ownerEmail}
                        onChange={handleChange}
                        placeholder="owner@example.com"
                        className="mt-2 block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-4">
                    <div className="flex gap-3">
                      <svg className="h-5 w-5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-900">Contact Information</p>
                        <p className="mt-1 text-xs text-blue-700">
                          We&apos;ll use this information to contact you regarding your application status and any required documents.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location Information */}
            {currentStep === 3 && (
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Location Information</h2>
                  <p className="mt-1 text-sm text-slate-600">Where will your business be located?</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-slate-700">
                      Complete Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street, Building, Unit Number"
                      className="mt-2 block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label htmlFor="barangayId" className="block text-sm font-semibold text-slate-700">
                      Barangay <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="barangayId"
                      name="barangayId"
                      required
                      value={formData.barangayId}
                      onChange={handleChange}
                      className="mt-2 block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="">Select a barangay</option>
                      {barangays?.map((barangay) => (
                        <option key={barangay.id} value={barangay.id}>
                          {barangay.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      GPS Coordinates <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 grid gap-4 md:grid-cols-2">
                      <input
                        type="number"
                        step="any"
                        id="latitude"
                        name="latitude"
                        required
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="Latitude (e.g., 7.3697)"
                        className="block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      />
                      <input
                        type="number"
                        step="any"
                        id="longitude"
                        name="longitude"
                        required
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="Longitude (e.g., 125.6481)"
                        className="block w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Use My Current Location
                  </button>

                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Automated Compliance Check</h4>
                        <p className="mt-1 text-xs text-slate-600">
                          Our system will automatically verify:
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-slate-600">
                          <li className="flex items-center gap-2">
                            <span className="text-green-600">✓</span> Zoning compliance for your business type
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-green-600">✓</span> Hazard zone detection (flood, landslide)
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-green-600">✓</span> Proximity rules with nearby businesses
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && (
              <div className="p-8">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                    <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Application Submitted!</h2>
                  <p className="mt-3 text-slate-600">
                    Your business permit application has been successfully submitted.
                  </p>
                  <div className="mt-8 w-full max-w-md rounded-xl bg-slate-50 p-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Business Name:</span>
                        <span className="font-semibold text-slate-900">{formData.businessName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Owner:</span>
                        <span className="font-semibold text-slate-900">{formData.ownerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Location:</span>
                        <span className="font-semibold text-slate-900">{barangays?.find(b => b.id === formData.barangayId)?.name}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-sm text-slate-500">
                    Redirecting to application details...
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="border-t border-slate-200 bg-slate-50 px-8 py-6">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  {currentStep === 3 ? (
                    <button
                      type="submit"
                      disabled={createBusiness.isPending}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50"
                    >
                      {createBusiness.isPending ? (
                        <>
                          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
                    >
                      Next Step
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Need Help?</h3>
              <p className="mt-1 text-sm text-slate-600">
                If you have questions about the application process, please contact the Municipal Planning and Development Office at{" "}
                <a href="tel:+639123456789" className="font-medium text-blue-600 hover:text-blue-700">
                  +63 912 345 6789
                </a>{" "}
                or email{" "}
                <a href="mailto:mpdo@santotomas.gov.ph" className="font-medium text-blue-600 hover:text-blue-700">
                  mpdo@santotomas.gov.ph
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
