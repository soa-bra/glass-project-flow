
import { useState, useCallback, useMemo } from 'react';
import type { ImageState } from '@/types';

export const useImageState = () => {
  const [imageState, setImageState] = useState<ImageState>({
    error: false,
    loaded: false
  });

  const handleImageError = useCallback(() => {
    setImageState(prev => ({ ...prev, error: true }));
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageState(prev => ({ ...prev, loaded: true }));
  }, []);

  const imageStyle = useMemo(() => ({
    opacity: imageState.loaded ? 1 : 0.7,
    border: '1px solid rgba(255,255,255,0.2)'
  }), [imageState.loaded]);

  return {
    imageState,
    handleImageError,
    handleImageLoad,
    imageStyle
  };
};
