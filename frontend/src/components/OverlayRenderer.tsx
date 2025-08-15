'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, RefreshCw } from 'lucide-react'
import { OverlayRendererProps, ActivityData, OverlayStyle } from '../../types'

export function OverlayRenderer({ 
  activityData, 
  backgroundImage, 
  overlayStyle 
}: OverlayRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRendering, setIsRendering] = useState(false)
  const [renderedImage, setRenderedImage] = useState<string | null>(null)

  const defaultStyle: OverlayStyle = {
    primaryColor: '#1a1a1a',
    secondaryColor: '#666666',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontSize: 48,
    position: 'bottom',
    showMap: true,
    showStats: true,
    ...overlayStyle
  }

  const renderOverlay = async () => {
    if (!canvasRef.current || !activityData) return

    setIsRendering(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to Instagram Story dimensions
    canvas.width = 1080
    canvas.height = 1920

    try {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background image if provided
      if (backgroundImage) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = backgroundImage
        })

        // Calculate scaling to cover the entire canvas
        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        )
        
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        
        // Center the image
        const x = (canvas.width - scaledWidth) / 2
        const y = (canvas.height - scaledHeight) / 2
        
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
      } else {
        // Draw default gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#f8fafc')
        gradient.addColorStop(1, '#e2e8f0')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Draw overlay content
      if (defaultStyle.showStats) {
        drawActivityStats(ctx, canvas, activityData, defaultStyle)
      }

      if (defaultStyle.showMap && activityData.coordinates.length > 0) {
        drawRouteMap(ctx, canvas, activityData.coordinates, defaultStyle)
      }

      // Draw activity name
      drawActivityName(ctx, canvas, activityData.name, defaultStyle)

      // Convert to data URL
      const imageDataUrl = canvas.toDataURL('image/png')
      setRenderedImage(imageDataUrl)

    } catch (error) {
      console.error('Error rendering overlay:', error)
    } finally {
      setIsRendering(false)
    }
  }

  const drawActivityStats = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: ActivityData, style: OverlayStyle) => {
    const stats = [
      { label: 'Distance', value: formatDistance(data.distance) },
      { label: 'Duration', value: formatDuration(data.duration) },
      { label: 'Elevation', value: formatElevation(data.elevation) },
      { label: 'Pace', value: formatPace(data.pace) }
    ]

    const startY = style.position === 'top' ? 120 : canvas.height - 400
    const spacing = 80

    stats.forEach((stat, index) => {
      const y = startY + (index * spacing)
      
      // Draw label
      ctx.fillStyle = style.secondaryColor
      ctx.font = `400 ${style.fontSize * 0.6}px Inter, system-ui, sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText(stat.label, 60, y)
      
      // Draw value
      ctx.fillStyle = style.primaryColor
      ctx.font = `600 ${style.fontSize}px Inter, system-ui, sans-serif`
      ctx.fillText(stat.value, 60, y + 45)
    })
  }

  const drawRouteMap = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, coordinates: Array<{ lat: number; lng: number }>, style: OverlayStyle) => {
    if (coordinates.length < 2) return

    // Calculate bounds
    const bounds = calculateBounds(coordinates)
    const padding = 40
    const mapWidth = canvas.width - (padding * 2)
    const mapHeight = 400
    const mapY = style.position === 'top' ? 500 : 200

    // Draw map background
    ctx.fillStyle = style.backgroundColor
    ctx.fillRect(padding, mapY, mapWidth, mapHeight)

    // Draw route line
    ctx.strokeStyle = style.primaryColor
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()

    coordinates.forEach((coord, index) => {
      const x = longitudeToX(coord.lng, bounds, padding, mapWidth)
      const y = latitudeToY(coord.lat, bounds, mapY, mapHeight)
      
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
    
    const startX = longitudeToX(startCoord.lng, bounds, padding, mapWidth)
    const startY = latitudeToY(startCoord.lat, bounds, mapY, mapHeight)
    const endX = longitudeToX(endCoord.lng, bounds, padding, mapWidth)
    const endY = latitudeToY(endCoord.lat, bounds, mapY, mapHeight)

    // Start marker (green)
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.arc(startX, startY, 8, 0, 2 * Math.PI)
    ctx.fill()

    // End marker (red)
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(endX, endY, 8, 0, 2 * Math.PI)
    ctx.fill()
  }

  const drawActivityName = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, name: string, style: OverlayStyle) => {
    const maxWidth = canvas.width - 120
    const fontSize = Math.min(style.fontSize * 1.2, 72)
    
    ctx.fillStyle = style.primaryColor
    ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`
    ctx.textAlign = 'center'
    
    // Truncate name if too long
    let displayName = name
    if (ctx.measureText(name).width > maxWidth) {
      displayName = name.substring(0, 20) + '...'
    }
    
    const y = style.position === 'top' ? 60 : canvas.height - 60
    ctx.fillText(displayName, canvas.width / 2, y)
  }

  const calculateBounds = (coordinates: Array<{ lat: number; lng: number }>) => {
    const lats = coordinates.map(c => c.lat)
    const lngs = coordinates.map(c => c.lng)
    
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs)
    }
  }

  const longitudeToX = (lng: number, bounds: any, padding: number, mapWidth: number) => {
    return padding + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * mapWidth
  }

  const latitudeToY = (lat: number, bounds: any, mapY: number, mapHeight: number) => {
    return mapY + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * mapHeight
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

  const formatElevation = (meters: number) => {
    return `${Math.round(meters)} m`
  }

  const formatPace = (secondsPerKm: number) => {
    const minutes = Math.floor(secondsPerKm / 60)
    const seconds = Math.round(secondsPerKm % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}/km`
  }

  const handleDownload = () => {
    if (!renderedImage) return

    const link = document.createElement('a')
    link.href = renderedImage
    link.download = `routeshare-overlay-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Auto-render when component mounts or data changes
  useEffect(() => {
    if (activityData) {
      renderOverlay()
    }
  }, [activityData, backgroundImage, overlayStyle])

  if (!activityData) {
    return (
      <div className="text-center py-8 text-primary-500">
        <p>No activity data available</p>
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
      {/* Canvas Container */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-auto border border-primary-200 rounded-lg bg-white"
          style={{ aspectRatio: '9/16' }}
        />
        
        {/* Loading Overlay */}
        {isRendering && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-accent-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-primary-600">Rendering overlay...</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {renderedImage && (
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={handleDownload}
            className="flex-1 btn-primary flex items-center justify-center gap-2 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Download PNG
          </motion.button>
          
          <motion.button
            onClick={renderOverlay}
            disabled={isRendering}
            className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className={`w-4 h-4 ${isRendering ? 'animate-spin' : ''}`} />
            {isRendering ? 'Rendering...' : 'Refresh'}
          </motion.button>
        </motion.div>
      )}

      {/* Canvas Info */}
      <div className="text-center text-sm text-primary-500">
        <p>Export: Transparent PNG sized to content</p>
        <p>Real-time preview with custom styling</p>
      </div>
    </motion.div>
  )
}
