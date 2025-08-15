'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'
import { RouteMapProps } from '../../types'

export function RouteMap({ coordinates }: RouteMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || coordinates.length < 2) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = 200

    // Calculate bounds
    const lats = coordinates.map(c => c.lat)
    const lngs = coordinates.map(c => c.lng)
    
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    
    // Add padding
    const latPadding = (maxLat - minLat) * 0.1
    const lngPadding = (maxLng - minLng) * 0.1
    
    const paddedMinLat = minLat - latPadding
    const paddedMaxLat = maxLat + latPadding
    const paddedMinLng = minLng - lngPadding
    const paddedMaxLng = maxLng + lngPadding

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw route line
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()

    coordinates.forEach((coord, index) => {
      const x = ((coord.lng - paddedMinLng) / (paddedMaxLng - paddedMinLng)) * canvas.width
      const y = ((paddedMaxLat - coord.lat) / (paddedMaxLat - paddedMinLat)) * canvas.height
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw start and end markers
    const startCoord = coordinates[0]
    const endCoord = coordinates[coordinates.length - 1]
    
    const startX = ((startCoord.lng - paddedMinLng) / (paddedMaxLng - paddedMinLng)) * canvas.width
    const startY = ((paddedMaxLat - startCoord.lat) / (paddedMaxLat - paddedMinLat)) * canvas.height
    const endX = ((endCoord.lng - paddedMinLng) / (paddedMaxLng - paddedMinLng)) * canvas.width
    const endY = ((paddedMaxLat - endCoord.lat) / (paddedMaxLat - paddedMinLat)) * canvas.height

    // Start marker (green)
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.arc(startX, startY, 6, 0, 2 * Math.PI)
    ctx.fill()

    // End marker (red)
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(endX, endY, 6, 0, 2 * Math.PI)
    ctx.fill()

    // Add labels
    ctx.fillStyle = '#374151'
    ctx.font = '12px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    
    // Start label
    ctx.fillText('Start', startX, startY - 10)
    
    // End label
    ctx.fillText('End', endX, endY - 10)

  }, [coordinates])

  if (coordinates.length < 2) {
    return (
      <div className="text-center py-8 text-primary-500">
        <Navigation className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Insufficient coordinates to display route</p>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Route Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-48 rounded-lg border border-primary-200"
        />
        
        {/* Route Info Overlay */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-accent-600" />
            <span className="text-primary-700">
              {coordinates.length} points
            </span>
          </div>
        </div>
      </div>

      {/* Route Summary */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <p className="text-primary-600">Start</p>
          <p className="font-medium text-primary-900">
            {coordinates[0].lat.toFixed(4)}, {coordinates[0].lng.toFixed(4)}
          </p>
        </div>
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <p className="text-primary-600">End</p>
          <p className="font-medium text-primary-900">
            {coordinates[coordinates.length - 1].lat.toFixed(4)}, {coordinates[coordinates.length - 1].lng.toFixed(4)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
