'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, File, Loader2, CheckCircle } from 'lucide-react'
import { FileUploadProps } from '@/types'
import { api } from '@/lib/apiClient'

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus('uploading')
    setErrorMessage('')

    try {
      const data = await api.gpx.uploadFile(file)
      onDataLoaded(data.activityData)
      setUploadStatus('success')
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle')
      }, 3000)
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setErrorMessage(errorMessage)
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
    }
  }, [onDataLoaded])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/gpx+xml': ['.gpx'],
      'text/xml': ['.gpx'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const getDropzoneClasses = () => {
    let baseClasses = "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer"
    
    if (isDragActive && !isDragReject) {
      baseClasses += " border-accent-400 bg-accent-50"
    } else if (isDragReject) {
      baseClasses += " border-red-400 bg-red-50"
    } else {
      baseClasses += " border-primary-300 bg-primary-50 hover:border-primary-400 hover:bg-primary-100"
    }
    
    return baseClasses
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="w-8 h-8 text-accent-600 animate-spin" />
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />
      case 'error':
        return <File className="w-8 h-8 text-red-600" />
      default:
        return <Upload className="w-8 h-8 text-primary-400" />
    }
  }

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Processing GPX file...'
      case 'success':
        return 'File uploaded successfully!'
      case 'error':
        return 'Upload failed'
      default:
        return isDragActive ? 'Drop your GPX file here' : 'Drag & drop a GPX file, or click to select'
    }
  }

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className={getDropzoneClasses()}>
        <input {...getInputProps()} />
        
        <motion.div
          className="flex flex-col items-center space-y-4"
          animate={{ scale: isDragActive ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {getStatusIcon()}
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-primary-700">
              {getStatusText()}
            </p>
            <p className="text-sm text-primary-500">
              Supports GPX files up to 10MB
            </p>
          </div>
        </motion.div>
      </div>

      {/* Error Message */}
      {uploadStatus === 'error' && errorMessage && (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-red-700">{errorMessage}</p>
        </motion.div>
      )}

      {/* Success Message */}
      {uploadStatus === 'success' && (
        <motion.div
          className="bg-green-50 border border-green-200 rounded-lg p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-green-700">
            GPX file processed successfully! Your activity data is now loaded.
          </p>
        </motion.div>
      )}

      {/* File Requirements */}
      <div className="text-xs text-primary-500 space-y-1">
        <p>• Supported format: GPX (GPS Exchange Format)</p>
        <p>• Maximum file size: 10MB</p>
        <p>• File should contain track data with coordinates</p>
      </div>
    </div>
  )
}
