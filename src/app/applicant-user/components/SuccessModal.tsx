"use client";

import React from "react";

interface SuccessModalProps {
  isOpen: boolean;
  applicationNo: string;
  onClose: () => void;
  onViewApplications: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  applicationNo,
  onClose,
  onViewApplications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Success Icon & Header */}
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <svg
                className="h-12 w-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Application Submitted!
            </h2>
            <p className="mt-2 text-green-100">
              Your application has been successfully submitted
            </p>
          </div>

          {/* Application Number */}
          <div className="px-6 py-6">
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-sm font-medium text-gray-500">
                Application Number
              </p>
              <p className="mt-1 text-2xl font-bold tracking-wide text-gray-900">
                {applicationNo}
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Important</p>
                  <p className="mt-1">
                    Please save your application number for future reference.
                    You can track your application status using this number.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700">
                What happens next?
              </h3>
              <div className="mt-3 space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                    1
                  </div>
                  <p className="text-sm text-gray-600">
                    Your application will be reviewed by our team
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                    2
                  </div>
                  <p className="text-sm text-gray-600">
                    You will receive updates on your application status
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                    3
                  </div>
                  <p className="text-sm text-gray-600">
                    Decision will be delivered based on your selected method
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Submit Another
            </button>
            <button
              onClick={onViewApplications}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              View My Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
