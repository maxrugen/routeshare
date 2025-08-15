import { useState, useCallback, useMemo } from 'react';
import { ActivityData } from '../../types';
import { api } from '../lib/apiClient';

// Overlay style interface
interface OverlayStyle {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontSize: number;
  position: 'top' | 'center' | 'bottom';
  showMap: boolean;
  showStats: boolean;
}

// State interface
interface OverlayState {
  activityData: ActivityData | null;
  backgroundImage: string | null;
  overlayStyle: OverlayStyle;
  isGenerating: boolean;
  generatedOverlay: string | null;
  error: string | null;
  isLoading: boolean;
}

// Actions interface
interface OverlayActions {
  setActivityData: (data: ActivityData) => void;
  setBackgroundImage: (imageUrl: string | null) => void;
  updateOverlayStyle: (updates: Partial<OverlayStyle>) => void;
  generateOverlay: () => Promise<void>;
  resetState: () => void;
  clearError: () => void;
  loadDemoData: () => Promise<void>;
}

// Default overlay style
const defaultOverlayStyle: OverlayStyle = {
  primaryColor: '#1a1a1a',
  secondaryColor: '#666666',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  fontSize: 48,
  position: 'bottom',
  showMap: true,
  showStats: true,
};

export function useOverlayState(): OverlayState & OverlayActions {
  // Core state
  const [activityData, setActivityDataState] = useState<ActivityData | null>(null);
  const [backgroundImage, setBackgroundImageState] = useState<string | null>(null);
  const [overlayStyle, setOverlayStyleState] = useState<OverlayStyle>(defaultOverlayStyle);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOverlay, setGeneratedOverlay] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized state object
  const state = useMemo<OverlayState>(() => ({
    activityData,
    backgroundImage,
    overlayStyle,
    isGenerating,
    generatedOverlay,
    error,
    isLoading,
  }), [
    activityData,
    backgroundImage,
    overlayStyle,
    isGenerating,
    generatedOverlay,
    error,
    isLoading,
  ]);

  // Set activity data and reset overlay
  const setActivityData = useCallback((data: ActivityData) => {
    setActivityDataState(data);
    setGeneratedOverlay(null); // Reset overlay when new data is loaded
    setError(null);
  }, []);

  // Set background image and reset overlay
  const setBackgroundImage = useCallback((imageUrl: string | null) => {
    setBackgroundImageState(imageUrl);
    setGeneratedOverlay(null); // Reset overlay when background changes
    setError(null);
  }, []);

  // Update overlay style and reset overlay
  const updateOverlayStyle = useCallback((updates: Partial<OverlayStyle>) => {
    setOverlayStyleState(prev => ({ ...prev, ...updates }));
    setGeneratedOverlay(null); // Reset overlay when style changes
    setError(null);
  }, []);

  // Generate overlay
  const generateOverlay = useCallback(async () => {
    if (!activityData) {
      setError('No activity data available');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const overlayBlob = await api.overlay.generate({
        activityData,
        backgroundImage,
        overlayStyle,
      });

      const imageUrl = URL.createObjectURL(overlayBlob);
      setGeneratedOverlay(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate overlay';
      setError(errorMessage);
      console.error('Error generating overlay:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [activityData, backgroundImage, overlayStyle]);

  // Reset all state
  const resetState = useCallback(() => {
    setActivityDataState(null);
    setBackgroundImageState(null);
    setOverlayStyleState(defaultOverlayStyle);
    setIsGenerating(false);
    setGeneratedOverlay(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load demo data
  const loadDemoData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.gpx.getSample();
      setActivityDataState(response.activityData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load demo data';
      setError(errorMessage);
      console.error('Failed to load demo data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized actions object
  const actions = useMemo<OverlayActions>(() => ({
    setActivityData,
    setBackgroundImage,
    updateOverlayStyle,
    generateOverlay,
    resetState,
    clearError,
    loadDemoData,
  }), [
    setActivityData,
    setBackgroundImage,
    updateOverlayStyle,
    generateOverlay,
    resetState,
    clearError,
    loadDemoData,
  ]);

  return {
    ...state,
    ...actions,
  };
}
