'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { StravaConnectButtonProps } from '../../types'

export function StravaConnectButton({ onDataLoaded: _onDataLoaded }: StravaConnectButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    let timeoutId: any
    if (showTooltip) {
      timeoutId = setTimeout(() => setShowTooltip(false), 2500)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [showTooltip])

  const handleClick = () => {
    setShowTooltip(true)
  }

  return (
    <div className="relative space-y-2 flex flex-col items-center">
      <motion.button
        onClick={handleClick}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Connect with Strava (coming soon)"
        aria-describedby={showTooltip ? 'strava-coming-soon' : undefined}
      >
        <Activity className="w-5 h-5" />
        Connect with Strava
      </motion.button>

      {showTooltip && (
        <div
          id="strava-coming-soon"
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-primary-900 text-white text-sm px-3 py-2 rounded-md shadow-lg"
          >
            Strava integration is currently unavailable. Coming soon!
          </motion.div>
        </div>
      )}

      <p className="text-xs text-primary-500 text-center">
        Connect your Strava account to import your latest activities
      </p>
    </div>
  )
}

