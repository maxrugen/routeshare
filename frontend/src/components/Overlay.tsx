'use client'

import React from 'react';
import { ActivityData, OverlayStyle as BaseOverlayStyle, Coordinate } from '../../types';

type OverlayStyle = BaseOverlayStyle & {
  variant?: 'minimal' | 'card';
  unit?: 'km' | 'mi';
  locationText?: string;
};

// Hilfsfunktionen (getMapPath, formatDuration) bleiben hier unverändert...
const getMapPath = (coordinates: Coordinate[], viewBoxWidth: number, viewBoxHeight: number): string => {
  if (coordinates.length < 2) return '';
  const padding = 40;
  const lats = coordinates.map(c => c.lat);
  const lngs = coordinates.map(c => c.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;
  const scaleX = (viewBoxWidth - padding * 2) / lngRange;
  const scaleY = (viewBoxHeight - padding * 2) / latRange;
  const scale = Math.min(scaleX, scaleY);

  return coordinates.map((coord, index) => {
    const x = padding + (coord.lng - minLng) * scale;
    const y = padding + (maxLat - coord.lat) * scale;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
};

const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const parts = [];
    if (hours > 0) parts.push(hours);
    parts.push(minutes < 10 && hours > 0 ? `0${minutes}` : minutes);
    parts.push(seconds < 10 ? `0${seconds}` : seconds);
    return parts.join(':');
};


// Die Props-Schnittstelle wird vereinfacht, da wir kein backgroundImage mehr benötigen
interface OverlayProps {
  activityData: ActivityData;
  overlayStyle: OverlayStyle;
}

export const Overlay = React.forwardRef<HTMLDivElement, OverlayProps>(
  ({ activityData, overlayStyle }, ref) => {
    const containerStyle = {
      color: overlayStyle.primaryColor || '#FFFFFF', // Weiß als Standard für bessere Sichtbarkeit auf Bildern
      alignItems: overlayStyle.position || 'flex-end',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      boxSizing: 'border-box' as const,
      // WICHTIG: Hintergrund ist jetzt immer transparent
      backgroundColor: 'transparent', 
    };

    const mapPath = getMapPath(activityData.coordinates, 800, 450);

    const distanceKm = activityData.distance / 1000;
    const miles = distanceKm * 0.621371;
    const distanceDisplay = (overlayStyle.unit === 'mi' ? miles : distanceKm).toFixed(1);
    const unitLabel = overlayStyle.unit === 'mi' ? 'mi' : 'km';

    return (
      <div
        ref={ref}
        id="overlay-export"
        className="w-[1080px] p-20 flex flex-col"
        style={containerStyle}
      >
        <div className="w-full">
          {overlayStyle.variant === 'card' ? (
            <div className="w-full rounded-3xl border-8 border-black/80 bg-white text-black p-10" style={{boxShadow: '0 6px 0 0 #000'}}>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="leading-none">
                  <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1 }}>{distanceDisplay} <span style={{fontSize: 48, fontWeight: 700}}>{unitLabel}</span></div>
                  <div style={{ color: '#6b7280', marginTop: 6, fontSize: 28 }}>pace — time</div>
                </div>
                <div className="text-right" style={{ color: '#111827'}}>
                  <div style={{ fontSize: 28, fontWeight: 600 }}>{new Date(activityData.startTime).toLocaleString()}</div>
                  {overlayStyle.locationText && (
                    <div style={{ fontSize: 24, color: '#6b7280'}}>{overlayStyle.locationText}</div>
                  )}
                </div>
              </div>

              {/* Map panel */}
              {mapPath && (
                <div className="rounded-2xl border-8" style={{borderColor: '#111827', background: '#e5e7eb', padding: 16}}>
                  <svg width="100%" viewBox="0 0 800 450">
                    <path d={mapPath} fill="none" stroke="#111827" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div style={{ color: '#6b7280', fontSize: 20, marginTop: 4 }}>Maps</div>
                </div>
              )}
            </div>
          ) : (
          <>
          {overlayStyle.showMap && mapPath && (
            <div className="mb-12" >
              <svg width="100%" viewBox="0 0 800 450">
                <path d={mapPath} fill="none" stroke={overlayStyle.primaryColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          {overlayStyle.showStats && (
            <div className="w-full text-center" style={{ display: 'flex', justifyContent: 'space-between', borderTop: `4px solid ${overlayStyle.secondaryColor}`, paddingTop: '32px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '96px', fontWeight: 'bold', lineHeight: 1 }}>{distanceDisplay}</p>
                <p style={{ fontSize: '36px', color: overlayStyle.secondaryColor, marginTop: '8px' }}>Kilometers</p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '96px', fontWeight: 'bold', lineHeight: 1 }}>{formatDuration(activityData.duration)}</p>
                <p style={{ fontSize: '36px', color: overlayStyle.secondaryColor, marginTop: '8px' }}>Duration</p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '96px', fontWeight: 'bold', lineHeight: 1 }}>{Math.round(activityData.elevation)}</p>
                <p style={{ fontSize: '36px', color: overlayStyle.secondaryColor, marginTop: '8px' }}>Elevation (m)</p>
              </div>
            </div>
          )}
          </>
          )}
        </div>
      </div>
    );
  }
);

Overlay.displayName = 'Overlay';