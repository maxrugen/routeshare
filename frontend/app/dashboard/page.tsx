'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { StravaConnectButton } from '@/components/StravaConnectButton'
import { FileUpload } from '@/components/FileUpload'
import { OverlayRenderer } from '@/components/OverlayRenderer'
import { OverlayPreview } from '@/components/OverlayPreview'
import { ActivityStats } from '@/components/ActivityStats'
import { RouteMap } from '@/components/RouteMap'
import { useOverlayState } from '@/hooks/useOverlayState'
import { SketchPicker, ColorResult } from 'react-color' // NEUER IMPORT

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'
  
  // Use the custom hook for all state management
  const {
    activityData,
    backgroundImage,
    overlayStyle,
    isGenerating,
    generatedOverlay,
    error,
    isLoading,
    setActivityData,
    setBackgroundImage,
    updateOverlayStyle,
    generateOverlay,
    loadDemoData,
    clearError,
  } = useOverlayState()

  // Load demo data if demo mode
  useEffect(() => {
    if (isDemo && !activityData) {
      loadDemoData()
    }
  }, [isDemo, activityData, loadDemoData])

  const handleActivityDataLoaded = (data: any) => {
    setActivityData(data)
  }

  const handleBackgroundImageUpload = (imageUrl: string) => {
    setBackgroundImage(imageUrl)
  }

  const handleStyleChange = (newStyle: Partial<typeof overlayStyle>) => {
    updateOverlayStyle(newStyle)
  }

  const handleDownloadOverlay = () => {
    if (!generatedOverlay) return

    const link = document.createElement('a')
    link.href = generatedOverlay
    link.download = `routeshare-overlay-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
            Create Your Overlay
          </h1>
          <p className="text-xl text-primary-600 max-w-2xl mx-auto">
            Import your activity data and design a beautiful Instagram Story overlay
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Data Import & Controls */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Data Import Section */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-primary-900 mb-6">
                Import Activity Data
              </h2>
              
              <div className="space-y-4">
                <StravaConnectButton onDataLoaded={handleActivityDataLoaded} />
                <div className="text-center text-primary-500">or</div>
                <FileUpload onDataLoaded={handleActivityDataLoaded} />
              </div>
            </div>

            {/* Activity Stats */}
            {activityData && (
              <motion.div 
                className="card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-primary-900 mb-4">
                  Activity Details
                </h3>
                <ActivityStats activityData={activityData} />
              </motion.div>
            )}

            {/* Route Map */}
            {activityData && activityData.coordinates.length > 0 && (
              <motion.div 
                className="card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold text-primary-900 mb-4">
                  Route Map
                </h3>
                <RouteMap coordinates={activityData.coordinates} />
              </motion.div>
            )}

            {/* Background Image Upload */}
            <div className="card">
              <h3 className="text-xl font-semibold text-primary-900 mb-4">
                Background Image (Optional)
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      handleBackgroundImageUpload(e.target?.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                className="input-field"
              />
              {backgroundImage && (
                <div className="mt-4">
                  <img 
                    src={backgroundImage} 
                    alt="Background" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-lg p-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={clearError}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}

            {/* Generate Button */}
            {activityData && (
              <motion.button
                onClick={generateOverlay}
                disabled={isGenerating}
                className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {isGenerating ? 'Generating...' : 'Generate Overlay'}
              </motion.button>
            )}
          </motion.div>

          {/* Right Column - Overlay Preview */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Overlay Preview */}
            {generatedOverlay ? (
              <motion.div 
                className="card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-primary-900">
                    Your Overlay
                  </h3>
                  <button
                    onClick={handleDownloadOverlay}
                    className="btn-secondary py-2 px-4"
                  >
                    Download
                  </button>
                </div>
                <OverlayPreview overlayUrl={generatedOverlay} />
              </motion.div>
            ) : (
              <div className="card">
                <h3 className="text-xl font-semibold text-primary-900 mb-4">
                  Overlay Preview
                </h3>
                <div className="bg-primary-100 rounded-lg p-8 text-center text-primary-500">
                  {activityData ? (
                    <p>Click "Generate Overlay" to see your preview</p>
                  ) : (
                    <p>Import activity data to get started</p>
                  )}
                </div>
              </div>
            )}

            {/* Style Controls */}
            {activityData && (
              <motion.div 
                className="card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold text-primary-900 mb-4">
                  Customize Style
                </h3>
                <div className="space-y-4">
                  
                  {/* ERSETZTER FARBWÄHLER */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Primary Color
                    </label>
                    <SketchPicker
                      color={overlayStyle.primaryColor}
                      onChangeComplete={(color: ColorResult) => handleStyleChange({ primaryColor: color.hex })}
                      // Optional: Disable alpha if you don't need transparency
                      disableAlpha={true} 
                      // Optional: Use a preset of colors
                      presetColors={['#FFFFFF', '#000000', '#FF5733', '#33FF57', '#3357FF']}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Position
                    </label>
                    <select
                      value={overlayStyle.position}
                      onChange={(e) => handleStyleChange({ position: e.target.value as any })}
                      className="input-field"
                    >
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={overlayStyle.showMap}
                        onChange={(e) => handleStyleChange({ showMap: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-primary-700">Show Map</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={overlayStyle.showStats}
                        onChange={(e) => handleStyleChange({ showStats: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-primary-700">Show Stats</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}