'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Loader2 } from 'lucide-react'
import { StravaConnectButtonProps } from '../../types'
import { api } from '../lib/apiClient'
import { useSearchParams } from 'next/navigation'

export function StravaConnectButton({ onDataLoaded }: StravaConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [activities, setActivities] = useState<any[]>([])
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const searchParams = useSearchParams()

  // Detect return from Strava and/or existing session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const profile = await api.auth.getProfile()
        if (profile?.isAuthenticated) {
          setIsConnected(true)
        }
      } catch (_) {
        setIsConnected(false)
      }
    }

    // Trigger on mount and when ?auth=success is present
    const authStatus = searchParams.get('auth')
    if (authStatus === 'success') {
      checkAuth()
    } else {
      checkAuth()
    }
  }, [searchParams])

  const handleStravaConnect = async () => {
    setIsConnecting(true)
    
    try {
      // Redirect to Strava OAuth
      window.location.href = api.auth.getStravaAuthUrl()
    } catch (error) {
      console.error('Failed to connect to Strava:', error)
      setIsConnecting(false)
    }
  }

  const handleActivitySelect = async (activityId: number) => {
    try {
      // Note: This endpoint doesn't exist yet in our backend
      // You would need to implement it or use a different approach
      console.log('Activity selection not yet implemented')
    } catch (error) {
      console.error('Failed to fetch activity details:', error)
    }
  }

  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`
    }
    return `${Math.round(distance)} m`
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <motion.button
          onClick={handleStravaConnect}
          disabled={isConnecting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isConnecting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Activity className="w-5 h-5" />
          )}
          {isConnecting ? 'Connecting...' : 'Connect with Strava'}
        </motion.button>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-green-600 font-medium">Connected to Strava</p>
          </div>
          
          {activities.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Select an Activity
              </label>
              <select
                value={selectedActivity?.id || ''}
                onChange={(e) => {
                  const activity = activities.find(a => a.id === parseInt(e.target.value))
                  if (activity) {
                    handleActivitySelect(activity.id)
                  }
                }}
                className="input-field"
              >
                <option value="">Choose an activity...</option>
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.name} - {formatDistance(activity.distance)} - {formatDuration(activity.moving_time)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      
      <p className="text-xs text-primary-500 text-center">
        Connect your Strava account to import your latest activities
      </p>
    </div>
  )
}
