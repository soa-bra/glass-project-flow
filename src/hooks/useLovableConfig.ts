
import { useState, useEffect } from 'react';
import configData from '../config/lovable-config.json';

export interface LovableConfig {
  id: string;
  layout: {
    columnWidths: {
      projects: string;
      workspace: string;
    };
    panelGrid: {
      cols: number;
      rows: number;
      areas: string[][];
    };
  };
  entryMotion: {
    cardPulse: {
      scale: number[];
      duration: number;
    };
    pushOperationsBoard: {
      target: string;
      translateX: number[];
      opacity: number[];
      duration: number;
      easing: number[];
    };
    panelGrow: {
      target: string;
      from: { clipPath: string };
      to: { clipPath: string };
      opacity: number[];
      duration: number;
      easing: number[];
    };
  };
  exitMotion: {
    reverse: boolean;
    duration: number;
    easing: number[];
  };
  theme: {
    font: string;
    radius: string;
    glass: {
      bg: string;
      backdrop: string;
      border: string;
      shadow: string;
    };
    colors: {
      accent: string;
      success: string;
      danger: string;
      textPrimary: string;
      textSecondary: string;
    };
    ease: number[];
  };
  quickActions: Array<{
    icon: string;
    text: string;
    handler: string;
    color: string;
  }>;
  phaseBar: {
    phases: string[];
    segmentStyle: {
      height: string;
      inactive: string;
      activeGradient: string;
    };
    marker: {
      shape: string;
      iconCompleted: string;
      iconLocked: string;
    };
    transition: {
      duration: number;
      type: string;
      stiffness: number;
    };
  };
}

export const useLovableConfig = () => {
  const [config] = useState<LovableConfig>(configData as LovableConfig);
  
  return config;
};
