"use client";

import React, { useRef, useCallback } from "react";
import Image from "next/image";
import type { FileUploadProps } from "../types";
import { ACCEPTED_FILE_EXTENSIONS, MAX_FILE_SIZE } from "../schemas/document.schema";

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  fieldKey,
  state,
  onFileSelect,
  onFileRemove,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { file, preview, error, isUploading, uploadProgress, s3Url } = state;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        onFileSelect(fieldKey, droppedFile);
      }
    },
    [fieldKey, onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        onFileSelect(fieldKey, selectedFile);
      }
    },
    [fieldKey, onFileSelect]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onFileRemove(fieldKey);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [fieldKey, onFileRemove]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isPdf = file?.type === "application/pdf";

  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        <span className="ml-1 text-red-500">*</span>
      </label>
      <p className="mb-2 text-xs text-gray-500">{description}</p>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
          error
            ? "border-red-400 bg-red-50 hover:bg-red-100"
            : file
              ? "border-green-400 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILE_EXTENSIONS}
          onChange={handleFileChange}
          className="hidden"
          aria-label={`Upload ${label}`}
        />

        {isUploading ? (
          <div className="flex flex-col items-center py-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Uploading to cloud...</p>
            <div className="mt-2 w-full max-w-xs">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {preview && !isPdf ? (
                <Image
                  src={preview}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-200">
                  <svg
                    className="h-8 w-8 text-gray-500"
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
              )}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                {s3Url && (
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Uploaded to cloud
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-full p-1 text-red-500 hover:bg-red-100 transition-colors"
              aria-label={`Remove ${label}`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="py-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span>{" "}
              or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {ACCEPTED_FILE_EXTENSIONS} (Max {MAX_FILE_SIZE / (1024 * 1024)}MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
