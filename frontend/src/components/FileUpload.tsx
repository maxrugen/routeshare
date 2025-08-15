'use client'

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Loader2, CheckCircle } from 'lucide-react';
import { FileUploadProps } from '@/types';
import { api } from '@/lib/apiClient';

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);
    setError(null);

    try {
      const response = await api.gpx.upload(file);
      onDataLoaded(response.activityData);
      setUploadSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Upload failed: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }, [onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/gpx+xml': ['.gpx'] },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="text-center">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-primary-300 hover:border-blue-400'}
                    px-6 py-10`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-primary-600">
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="font-semibold">Uploading...</p>
              <p className="text-sm">Please wait while we process your file.</p>
            </>
          ) : uploadSuccess ? (
            <>
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <p className="font-semibold text-green-700">File uploaded successfully!</p>
              <p className="text-sm">Your activity data is now loaded.</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 mt-6 mb-4" />
              <p className="font-semibold mb-2">
                {isDragActive ? 'Drop the GPX file here' : 'Drag & drop a GPX file, or click to select'}
              </p>
              <p className="text-sm mb-2">Supports GPX files up to 10MB</p>
            </>
          )}
        </div>
      </div>
      
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {!error && !uploadSuccess && (
          <ul className="mt-4 mb-4 text-xs text-left text-primary-500 list-disc list-inside space-y-1">
              <li>Supported format: GPX (GPS Exchange Format)</li>
              <li>Maximum file size: 10MB</li>
              <li>File should contain track data with coordinates</li>
          </ul>
      )}
    </div>
  );
}