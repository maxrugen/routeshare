'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, TrendingUp, Zap } from 'lucide-react'
import { ActivityStatsProps } from '../../types'

export function ActivityStats({ activityData }: ActivityStatsProps) {
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

  const formatPace = (secondsPerKm: number) => {
    const minutes = Math.floor(secondsPerKm / 60)
    const seconds = Math.round(secondsPerKm % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}/km`
  }

  const formatElevation = (meters: number) => {
    return `${Math.round(meters)} m`
  }

  const stats = [
    {
      icon: MapPin,
      label: 'Distance',
      value: formatDistance(activityData.distance),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Clock,
      label: 'Duration',
      value: formatDuration(activityData.duration),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: TrendingUp,
      label: 'Elevation',
      value: formatElevation(activityData.elevation),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Zap,
      label: 'Pace',
      value: formatPace(activityData.pace),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Activity Name */}
      <div className="text-center pb-4 border-b border-primary-200">
        <h4 className="text-lg font-semibold text-primary-900 mb-1">
          {activityData.name}
        </h4>
        <p className="text-sm text-primary-500 capitalize">
          {activityData.type}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="text-center p-4 rounded-lg bg-primary-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className={`w-10 h-10 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-sm text-primary-600 mb-1">{stat.label}</p>
            <p className="text-lg font-semibold text-primary-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="pt-4 border-t border-primary-200">
        <div className="flex justify-between text-sm text-primary-600">
          <span>Started:</span>
          <span>{new Date(activityData.startTime).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-sm text-primary-600">
          <span>Track Points:</span>
          <span>{activityData.coordinates.length}</span>
        </div>
      </div>
    </div>
  )
}
