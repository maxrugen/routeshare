'use client'

import { useEffect, useRef, useState, Suspense } from 'react';
import * as htmlToImage from 'html-to-image';
import { motion } from 'framer-motion';
import { StravaConnectButton } from '../../src/components/StravaConnectButton';
import { FileUpload } from '../../src/components/FileUpload';
import { useOverlayState } from '../../src/hooks/useOverlayState';
import { Overlay } from '../../src/components/Overlay';
import { Download } from 'lucide-react';

function DashboardContent() {
  const {
    activityData, overlayStyle, error,
    setActivityData, updateOverlayStyle, clearError,
  } = useOverlayState();

  const overlayRef = useRef<HTMLDivElement>(null);
  // Neuer State, um den Ladezustand pro Button zu steuern
  const [exportingColor, setExportingColor] = useState<'white' | 'black' | null>(null);

  
  
  const handleExport = (color: 'white' | 'black') => {
    if (overlayRef.current === null) return;

    setExportingColor(color);

    // Style-Zustand für den Export aktualisieren
    const newPrimaryColor = color === 'white' ? '#FFFFFF' : '#111827';
    updateOverlayStyle({ 
      primaryColor: newPrimaryColor, 
      secondaryColor: color === 'white' ? '#FFFFFFB3' : '#6B7280' 
    });

    // Kurze Verzögerung, um React Zeit zum Re-Rendern der Overlay-Komponente mit der neuen Farbe zu geben
    setTimeout(() => {
      const node = overlayRef.current!;
      const rect = node.getBoundingClientRect();
      const width = Math.round(rect.width || 1080);
      const height = Math.round((node as HTMLDivElement).scrollHeight || rect.height || 1920);
      htmlToImage.toPng(node, { cacheBust: true, pixelRatio: 1, width, height, backgroundColor: 'transparent' })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `routeshare-overlay-${color}-${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => console.error('Oops, something went wrong!', err))
        .finally(() => setExportingColor(null)); // Ladezustand zurücksetzen
    }, 100);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">Create Your Overlay</h1>
          <p className="text-xl text-primary-600 max-w-2xl mx-auto">Import your activity data and design a beautiful transparent overlay for your stories.</p>
        </motion.div>

        {/* Vereinfachtes, zentriertes Layout */}
        <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto">
            <div className="card">
                {/* Die Ansicht ändert sich, je nachdem ob Daten geladen sind */}
                {!activityData ? (
                    <>
                        <h2 className="text-xl font-semibold text-primary-900 mb-4">1. Import Activity Data</h2>
                        <div className="space-y-4">
                        <StravaConnectButton onDataLoaded={setActivityData} />
                        <div className="text-center text-primary-500">or</div>
                        <FileUpload onDataLoaded={setActivityData} />
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold text-primary-900 mb-4">2. Export Your Overlay</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                          <div className="card">
                            <label className="block text-sm font-medium text-primary-700 mb-2">Units</label>
                            <div className="flex gap-2">
                              <button onClick={() => updateOverlayStyle({ unit: 'km' as any })} className="btn-secondary flex-1 py-2">km</button>
                              <button onClick={() => updateOverlayStyle({ unit: 'mi' as any })} className="btn-secondary flex-1 py-2">mi</button>
                            </div>
                          </div>
                          <div className="card md:col-span-1">
                            <label className="block text-sm font-medium text-primary-700 mb-2">Location (optional)</label>
                            <input onChange={(e) => updateOverlayStyle({ locationText: e.target.value })} placeholder="e.g., Hilton Head Island, SC" className="input-field" />
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 text-green-800 rounded-lg text-center mb-6">
                            <p>GPX file processed successfully!</p>
                        </div>
                        <p className="text-center text-primary-600 mb-4">Choose a color for your overlay. It will be generated with a transparent background.</p>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Download-Button für weiße Variante */}
                            <button 
                                onClick={() => handleExport('white')} 
                                disabled={!!exportingColor}
                                className="btn-secondary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                            >
                                {exportingColor === 'white' ? <div className="w-5 h-5 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div> : <Download className="w-5 h-5"/>}
                                White Overlay
                            </button>
                            {/* Download-Button für schwarze Variante */}
                            <button 
                                onClick={() => handleExport('black')} 
                                disabled={!!exportingColor}
                                className="btn-secondary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                            >
                                {exportingColor === 'black' ? <div className="w-5 h-5 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div> : <Download className="w-5 h-5"/>}
                                Black Overlay
                            </button>
                        </div>
                    </>
                )}
            </div>
          
            {error && (
                <div className="card mt-8 bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}
        </div>
        
        {/* Die versteckte Komponente für den Export bleibt erhalten */}
        <div className="absolute -z-10 -left-[9999px] top-0">
          {activityData && overlayStyle && (
            <Overlay ref={overlayRef} activityData={activityData} overlayStyle={overlayStyle} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}