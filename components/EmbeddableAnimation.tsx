"use client"

import React, { useEffect, useState } from 'react'
import { PromptingIsAllYouNeed } from '../prompting'
import { SettingsProvider } from '../context/SettingsContext'

interface EmbeddableAnimationProps {
  width?: string;
  height?: string;
  text1?: string;
  text2?: string;
  mainColor?: string;
  hitColor?: string;
  ballColor?: string;
  paddleColor?: string;
  backgroundColor?: string;
  ballSpeed?: number;
  showBorder?: boolean;
}

export default function EmbeddableAnimation({
  width = '100%',
  height = '400px',
  text1,
  text2,
  mainColor,
  hitColor,
  ballColor,
  paddleColor,
  backgroundColor,
  ballSpeed,
  showBorder = true
}: EmbeddableAnimationProps) {
  // For client-side only rendering
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Custom settings for embedded version
  const initialSettings = {
    text: {
      line1: text1 || 'CHAITANYA',
      line2: text2 || 'PROJECTS CONSULTANCY LIMITED'
    },
    colors: {
      main: mainColor || '#08a281',
      hit: hitColor || '#073779',
      ball: ballColor || '#0ca581',
      paddle: paddleColor || '#08a281',
      background: backgroundColor || '#000000'
    },
    ballSpeed: ballSpeed || 2
  };

  if (!mounted) {
    return null; // Prevent SSR issues
  }

  return (
    <div 
      style={{ 
        width, 
        height, 
        overflow: 'hidden', 
        position: 'relative',
        border: showBorder ? '1px solid #333' : 'none',
        borderRadius: '8px'
      }}
    >
      <SettingsProvider initialSettings={initialSettings}>
        <PromptingIsAllYouNeed isEmbedded={true} />
      </SettingsProvider>
    </div>
  );
} 