'use client'

import { motion } from 'framer-motion'
import { Download, Share2, Instagram } from 'lucide-react'
import { OverlayPreviewProps } from '@/types'

export function OverlayPreview({ overlayUrl }: OverlayPreviewProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = overlayUrl
    link.download = `routeshare-overlay-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Activity Overlay',
          text: 'Check out this Instagram Story overlay I created with Routeshare!',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share cancelled or failed')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Overlay Image */}
      <div className="relative group">
        <div className="relative overflow-hidden rounded-lg border-2 border-primary-200 bg-white">
          <img
            src={overlayUrl}
            alt="Instagram Story Overlay"
            className="w-full h-auto object-contain"
            style={{ aspectRatio: '9/16' }} // Instagram Story ratio
          />
          
          {/* Overlay Info */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center">
              <Instagram className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Instagram Story Ready</p>
              <p className="text-xs opacity-80">1080 × 1920</p>
            </div>
          </div>
        </div>
        
        {/* Instagram Story Frame */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
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
          onClick={handleShare}
          className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 className="w-4 h-4" />
          Share
        </motion.button>
      </div>

      {/* Usage Instructions */}
      <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
        <h4 className="font-medium text-accent-900 mb-2 flex items-center gap-2">
          <Instagram className="w-4 h-4" />
          How to Use
        </h4>
        <div className="text-sm text-accent-700 space-y-1">
          <p>• Download the PNG file to your device</p>
          <p>• Open Instagram and create a new Story</p>
          <p>• Upload the overlay image</p>
          <p>• Adjust size and position as needed</p>
          <p>• Share your beautiful activity overlay!</p>
        </div>
      </div>

      {/* Image Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <p className="text-primary-600">Dimensions</p>
          <p className="font-medium text-primary-900">1080 × 1920</p>
        </div>
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <p className="text-primary-600">Format</p>
          <p className="font-medium text-primary-900">PNG</p>
        </div>
      </div>
    </motion.div>
  )
}
