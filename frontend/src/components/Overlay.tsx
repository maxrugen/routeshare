// frontend/src/components/Overlay.tsx
import React from 'react';
import { ActivityData, OverlayStyle } from '@/types';
import { RouteMap } from './RouteMap';
import { ActivityStats } from './ActivityStats';

interface OverlayProps {
  activityData: ActivityData;
  overlayStyle: OverlayStyle;
  backgroundImage: string | null;
}

export const Overlay = React.forwardRef<HTMLDivElement, OverlayProps>(
  ({ activityData, overlayStyle, backgroundImage }, ref) => {
    const style = {
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      backgroundColor: backgroundImage ? 'transparent' : '#FFFFFF',
      color: overlayStyle.primaryColor || '#000000',
    };

    return (
      <div
        ref={ref}
        id="overlay-export"
        className="w-[1080px] h-[1920px] bg-white bg-cover bg-center p-20 flex flex-col justify-end"
        style={style}
      >
        {/* We can add different layout containers based on style.position later */}
        <div className="w-full">
          {overlayStyle.showMap && activityData.coordinates.length > 0 && (
            <div className="mb-8 p-6 border-2 border-gray-200 rounded-2xl bg-white bg-opacity-75">
               <RouteMap coordinates={activityData.coordinates} />
            </div>
          )}

          {overlayStyle.showStats && (
             <ActivityStats activityData={activityData} />
          )}
        </div>
      </div>
    );
  }
);

Overlay.displayName = 'Overlay';