'use client'

import { useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { StravaConnectButton } from '@/components/StravaConnectButton';
import { FileUpload } from '@/components/FileUpload';
import { ActivityStats } from '@/components/ActivityStats';
import { RouteMap } from '@/components/RouteMap';
import { useOverlayState } from '@/hooks/useOverlayState';
import { SketchPicker, ColorResult } from 'react-color';
import { Overlay } from '@/components/Overlay';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';

  const {
    activityData,
    backgroundImage,
    overlayStyle,
    error,
    isLoading,
    setActivityData,
    setBackgroundImage,
    updateOverlayStyle,
    loadDemoData,
    clearError,
  } = useOverlayState();

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDemo && !activityData) {
      loadDemoData();
    }
  }, [isDemo, activityData, loadDemoData]);

  const handleActivityDataLoaded = (data: any) => {
    setActivityData(data);
  };

  const handleBackgroundImageUpload = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
  };

  const handleStyleChange = (newStyle: Partial<typeof overlayStyle>) => {
    updateOverlayStyle(newStyle);
  };

  const handleExport = () => {
    if (overlayRef.current === null) {
      return;
    }
    htmlToImage.toPng(overlayRef.current, { cacheBust: true, pixelRatio: 1 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `routeshare-overlay-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* GEÄNDERT: Zurück zum zweispaltigen Layout für Editor und Live-Preview */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Linke Spalte: Alle Controls */}
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">
                1. Import Activity Data
              </h2>
              <div className="space-y-4">
                <StravaConnectButton onDataLoaded={handleActivityDataLoaded} />
                <div className="text-center text-primary-500">or</div>
                <FileUpload onDataLoaded={handleActivityDataLoaded} />
              </div>
            </div>

            {activityData && (
              <>
                <div className="card">
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">
                    2. Background Image (Optional)
                  </h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          handleBackgroundImageUpload(e.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="input-field"
                  />
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">
                    3. Customize Style
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">
                        Primary Color
                      </label>
                      <SketchPicker
                        color={overlayStyle.primaryColor}
                        onChangeComplete={(color: ColorResult) => handleStyleChange({ primaryColor: color.hex })}
                        disableAlpha={true}
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
                        <input type="checkbox" checked={overlayStyle.showMap} onChange={(e) => handleStyleChange({ showMap: e.target.checked })} className="mr-2"/>
                        <span className="text-sm text-primary-700">Show Map</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={overlayStyle.showStats} onChange={(e) => handleStyleChange({ showStats: e.target.checked })} className="mr-2"/>
                        <span className="text-sm text-primary-700">Show Stats</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                     <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                <motion.button
                  onClick={handleExport}
                  disabled={isLoading}
                  className="btn-primary w-full py-4 text-lg sticky bottom-4"
                >
                  {isLoading ? 'Exporting...' : 'Export as Image'}
                </motion.button>
              </>
            )}
          </div>

          {/* Rechte Spalte: Die neue Live-Vorschau */}
          <div className="card sticky top-8">
            <h3 className="text-xl font-semibold text-primary-900 mb-4">
              Live Preview
            </h3>
            <div className="bg-primary-100 rounded-lg overflow-hidden aspect-[9/16] flex items-center justify-center">
              {activityData ? (
                // Container for scaling the full-size overlay down to fit the preview area
                <div className="w-[1080px] h-[1920px] transform origin-top-left" style={{ transform: 'scale(0.28)' }}>
                   <Overlay
                      ref={overlayRef}
                      activityData={activityData}
                      overlayStyle={overlayStyle}
                      backgroundImage={backgroundImage}
                    />
                </div>
              ) : (
                <div className="text-center text-primary-500">
                  <p>Import activity data to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}