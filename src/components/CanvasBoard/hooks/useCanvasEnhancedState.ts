import { useState } from 'react';

export const useCanvasEnhancedState = () => {
  // Enhanced canvas state
  const [smoothZoom, setSmoothZoom] = useState<boolean>(true);
  const [zoomToMouse, setZoomToMouse] = useState<boolean>(true);
  const [fitPadding, setFitPadding] = useState<number>(20);
  const [panSpeed, setPanSpeed] = useState<number>(1);
  
  // Smart pen enhanced state
  const [penColor, setPenColor] = useState<string>('#000000');
  const [smoothing, setSmoothing] = useState<number>(50);
  const [snapSensitivity, setSnapSensitivity] = useState<number>(20);
  const [autoGroup, setAutoGroup] = useState<boolean>(true);
  const [smartRecognition, setSmartRecognition] = useState<boolean>(true);
  const [selectedPenMode, setSelectedPenMode] = useState<string>('smart-draw');
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [lineStyle, setLineStyle] = useState<string>('solid');

  // AI state
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(true);

  return {
    // Enhanced state
    smoothZoom,
    zoomToMouse,
    fitPadding,
    panSpeed,
    penColor,
    smoothing,
    snapSensitivity,
    autoGroup,
    smartRecognition,
    selectedPenMode,
    lineWidth,
    lineStyle,
    isAIEnabled,

    // Enhanced setters
    setSmoothZoom,
    setZoomToMouse,
    setFitPadding,
    setPanSpeed,
    setPenColor,
    setSmoothing,
    setSnapSensitivity,
    setAutoGroup,
    setSmartRecognition,
    setSelectedPenMode,
    setLineWidth,
    setLineStyle,
    setIsAIEnabled,
  };
};