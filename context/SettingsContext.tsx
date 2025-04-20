"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define types for our settings
export interface AnimationSettings {
  colors: {
    main: string;
    hit: string;
    background: string;
    ball: string;
    paddle: string;
  };
  ballSpeed: number;
  text: {
    line1: string;
    line2: string;
  };
}

// Default settings
const defaultSettings: AnimationSettings = {
  colors: {
    main: "#08a281",
    hit: "#073779",
    background: "#000000",
    ball: "#0ca581",
    paddle: "#08a281"
  },
  ballSpeed: 2,
  text: {
    line1: "CHAITANYA",
    line2: "PROJECTS CONSULTANCY LIMITED"
  }
}

// Create context with default values
interface SettingsContextType {
  settings: AnimationSettings;
  updateColors: (colors: Partial<AnimationSettings['colors']>) => void;
  updateBallSpeed: (speed: number) => void;
  updateText: (text: Partial<AnimationSettings['text']>) => void;
  resetToDefaults: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Provider component
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Try to load saved settings from localStorage or use defaults
  const [settings, setSettings] = useState<AnimationSettings>(defaultSettings)
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('animationSettings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Failed to parse saved settings:', e)
      }
    }
  }, [])
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('animationSettings', JSON.stringify(settings))
  }, [settings])
  
  // Update functions
  const updateColors = (colors: Partial<AnimationSettings['colors']>) => {
    setSettings(prev => ({
      ...prev,
      colors: { ...prev.colors, ...colors }
    }))
  }
  
  const updateBallSpeed = (speed: number) => {
    setSettings(prev => ({
      ...prev,
      ballSpeed: speed
    }))
  }
  
  const updateText = (text: Partial<AnimationSettings['text']>) => {
    setSettings(prev => ({
      ...prev,
      text: { ...prev.text, ...text }
    }))
  }
  
  const resetToDefaults = () => {
    setSettings(defaultSettings)
  }
  
  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        updateColors, 
        updateBallSpeed, 
        updateText, 
        resetToDefaults 
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

// Custom hook for using the settings
export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
} 