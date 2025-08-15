'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { ActivityData } from '@/types'
import { StravaConnectButton } from '@/components/StravaConnectButton'
import { FileUpload } from '@/components/FileUpload'
import { OverlayRenderer } from '@/components/OverlayRenderer'
import { OverlayPreview } from '@/components/OverlayPreview'
import { ActivityStats } from '@/components/ActivityStats'
import { RouteMap } from '@/components/RouteMap'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'
  
  const [activityData, setActivityData] = useState<ActivityData | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [overlayStyle, setOverlayStyle] = useState({
    primaryColor: '#1a1a1a',
    secondaryColor: '#666666',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontSize: 48,
    position: 'bottom' as const,
    showMap: true,
    showStats: true,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedOverlay, setGeneratedOverlay] = useState<string | null>(null)

  // Load demo data if demo mode
  useEffect(() => {
    if (isDemo && !activityData) {
      loadDemoData()
    }
  }, [isDemo, activityData])

  const loadDemoData = async () => {
    try {
      const response = await fetch('/api/gpx/sample')
      const data = await response.json()
      setActivityData(data.activityData)
    } catch (error) {
      console.error('Failed to load demo data:', error)
    }
  }

  const handleActivityDataLoaded = (data: ActivityData) => {
    setActivityData(data)
    setGeneratedOverlay(null) // Reset overlay when new data is loaded
  }

  const handleBackgroundImageUpload = (imageUrl: string) => {
    setBackgroundImage(imageUrl)
    setGeneratedOverlay(null) // Reset overlay when background changes
  }

  const handleStyleChange = (newStyle: Partial<typeof overlayStyle>) => {
    setOverlayStyle(prev => ({ ...prev, ...newStyle }))
    setGeneratedOverlay(null) // Reset overlay when style changes
  }

  const handleGenerateOverlay = async () => {
    if (!activityData) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/overlay/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityData,
          backgroundImage,
          overlayStyle,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        setGeneratedOverlay(imageUrl)
      } else {
        throw new Error('Failed to generate overlay')
      }
    } catch (error) {
      console.error('Error generating overlay:', error)
      alert('Failed to generate overlay. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadOverlay = () => {
    if (!generatedOverlay) return

    const link = document.createElement('a')
    link.href = generatedOverlay
    link.download = `routeshot-overlay-${Date.now()}.png`
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

            {/* Generate Button */}
            {activityData && (
              <motion.button
                onClick={handleGenerateOverlay}
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
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={overlayStyle.primaryColor}
                      onChange={(e) => handleStyleChange({ primaryColor: e.target.value })}
                      className="w-full h-10 rounded-lg border border-primary-200"
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
