'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Camera, Download } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-10 md:pb-16">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-7xl font-bold text-primary-900 mb-4 md:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Transform Your
              <span className="text-accent-600 block">Activities into Art</span>
            </motion.h1>
            
            <motion.p 
              className="text-base md:text-2xl text-primary-600 mb-6 md:mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Create stunning Instagram Story overlays from your GPX files. 
              Beautiful, minimal designs that showcase your achievements.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/dashboard" className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              From data import to beautiful overlays, we've got you covered
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">
                Import Activities
              </h3>
              <p className="text-primary-600">
                Upload GPX files to import your activity data
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">
                Clean Overlays
              </h3>
              <p className="text-primary-600">
                Generate a minimal overlay with stats and map; export light or dark variants
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">
                Export & Share
              </h3>
              <p className="text-primary-600">
                Download your Instagram-ready overlays
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-r from-accent-600 to-accent-700 rounded-2xl p-12 text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Create Your First Overlay?
            </h2>
            <p className="text-xl text-accent-100 mb-8">
              Join thousands of athletes who are already sharing their achievements beautifully
            </p>
            <Link href="/dashboard" className="bg-white text-accent-600 hover:bg-accent-50 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 inline-flex items-center gap-2">
              Start Creating Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
