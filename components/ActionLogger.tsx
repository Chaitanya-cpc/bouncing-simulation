"use client"

import React, { useState, useEffect, useRef } from 'react';

export interface LogEntry {
  id: number;
  message: string;
  timestamp: Date;
}

export interface LoggerProps {
  addLog: (message: string) => void;
}

export default function ActionLogger() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const nextLogId = useRef(1);
  
  const addLog = (message: string) => {
    const newLog = {
      id: nextLogId.current++,
      message,
      timestamp: new Date()
    };
    
    setLogs(prevLogs => [...prevLogs, newLog]);
  };
  
  // Expose the addLog function globally for other components to use
  useEffect(() => {
    // @ts-ignore - Add to window for other components to access
    window.actionLogger = { addLog };
    
    // Clean up on unmount
    return () => {
      // @ts-ignore
      delete window.actionLogger;
    };
  }, []);
  
  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);
  
  // Format time as HH:MM:SS.mmm
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString() + '.' + date.getMilliseconds().toString().padStart(3, '0');
  };
  
  return (
    <>
      {/* Logger Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-gray-800 rounded-md hover:bg-opacity-80 transition-all duration-300 shadow-lg text-white"
        aria-label="Toggle Logger Panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
      </button>
      
      {/* Logger Panel */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-black bg-opacity-80 backdrop-blur-lg shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-4 text-white border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold">Event Log</h2>
          <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
            {logs.length} entries
          </span>
        </div>
        
        <div 
          ref={logContainerRef}
          className="flex-1 overflow-y-auto p-2 text-white text-xs space-y-1"
        >
          {logs.map(log => (
            <div key={log.id} className="p-2 bg-gray-800 rounded">
              <div className="text-gray-400 text-[10px]">{formatTime(log.timestamp)}</div>
              <div>{log.message}</div>
            </div>
          ))}
          
          {logs.length === 0 && (
            <div className="text-gray-500 italic p-2">No events logged yet.</div>
          )}
        </div>
        
        <div className="p-2 border-t border-gray-700">
          <button 
            onClick={() => setLogs([])}
            className="w-full py-1 bg-red-700 hover:bg-red-800 text-white text-sm rounded"
          >
            Clear Logs
          </button>
        </div>
      </div>
    </>
  );
} 