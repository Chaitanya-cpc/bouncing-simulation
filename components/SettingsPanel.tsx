"use client"

import React, { useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import { validateText, prepareTextForRendering } from '../utils/textHelpers'

export const SettingsPanel = () => {
  const { settings, updateColors, updateBallSpeed, updateText, resetToDefaults } = useSettings()
  const [isOpen, setIsOpen] = useState(false)

  const handleTextChange = (key: 'line1' | 'line2', value: string) => {
    // Prepare text for rendering (convert to uppercase, handle unsupported chars)
    const processedText = prepareTextForRendering(value);
    updateText({ [key]: processedText });
  };

  return (
    <>
      {/* Settings Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-4 bg-white rounded-full hover:bg-opacity-80 transition-all duration-300 shadow-lg"
        aria-label="Toggle Settings Panel"
        style={{ background: '#08a281' }} 
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

      {/* Settings Panel */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-black bg-opacity-80 backdrop-blur-lg shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
        <div className="p-6 text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Settings</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
              aria-label="Close Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Text Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Text</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Line 1</label>
                <input 
                  type="text" 
                  value={settings.text.line1}
                  onChange={(e) => handleTextChange('line1', e.target.value)}
                  className="w-full bg-gray-800 px-3 py-2 rounded text-white"
                  maxLength={25}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Line 2</label>
                <input 
                  type="text" 
                  value={settings.text.line2}
                  onChange={(e) => handleTextChange('line2', e.target.value)}
                  className="w-full bg-gray-800 px-3 py-2 rounded text-white"
                  maxLength={35}
                />
              </div>
            </div>
          </div>

          {/* Color Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Colors</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Main Text</label>
                <div className="flex">
                  <input 
                    type="color" 
                    value={settings.colors.main}
                    onChange={(e) => updateColors({ main: e.target.value })}
                    className="w-10 h-10 rounded overflow-hidden"
                  />
                  <input 
                    type="text" 
                    value={settings.colors.main}
                    onChange={(e) => updateColors({ main: e.target.value })}
                    className="flex-1 ml-2 bg-gray-800 px-3 py-2 rounded text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Hit Color</label>
                <div className="flex">
                  <input 
                    type="color" 
                    value={settings.colors.hit}
                    onChange={(e) => updateColors({ hit: e.target.value })}
                    className="w-10 h-10 rounded overflow-hidden"
                  />
                  <input 
                    type="text" 
                    value={settings.colors.hit}
                    onChange={(e) => updateColors({ hit: e.target.value })}
                    className="flex-1 ml-2 bg-gray-800 px-3 py-2 rounded text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Ball Color</label>
                <div className="flex">
                  <input 
                    type="color" 
                    value={settings.colors.ball}
                    onChange={(e) => updateColors({ ball: e.target.value })}
                    className="w-10 h-10 rounded overflow-hidden"
                  />
                  <input 
                    type="text" 
                    value={settings.colors.ball}
                    onChange={(e) => updateColors({ ball: e.target.value })}
                    className="flex-1 ml-2 bg-gray-800 px-3 py-2 rounded text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Paddle Color</label>
                <div className="flex">
                  <input 
                    type="color" 
                    value={settings.colors.paddle}
                    onChange={(e) => updateColors({ paddle: e.target.value })}
                    className="w-10 h-10 rounded overflow-hidden"
                  />
                  <input 
                    type="text" 
                    value={settings.colors.paddle}
                    onChange={(e) => updateColors({ paddle: e.target.value })}
                    className="flex-1 ml-2 bg-gray-800 px-3 py-2 rounded text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Background</label>
                <div className="flex">
                  <input 
                    type="color" 
                    value={settings.colors.background}
                    onChange={(e) => updateColors({ background: e.target.value })}
                    className="w-10 h-10 rounded overflow-hidden"
                  />
                  <input 
                    type="text" 
                    value={settings.colors.background}
                    onChange={(e) => updateColors({ background: e.target.value })}
                    className="flex-1 ml-2 bg-gray-800 px-3 py-2 rounded text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Speed Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Ball Speed</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Very Slow</span>
              <input 
                type="range" 
                min="0.1" 
                max="10" 
                step="0.1"
                value={settings.ballSpeed}
                onChange={(e) => updateBallSpeed(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none"
              />
              <span className="text-sm">Fast</span>
            </div>
            <div className="text-center mt-1 text-sm">
              Current: {settings.ballSpeed.toFixed(1)}
            </div>
          </div>

          {/* Reset Button */}
          <button 
            onClick={resetToDefaults}
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded font-medium transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </>
  )
} 