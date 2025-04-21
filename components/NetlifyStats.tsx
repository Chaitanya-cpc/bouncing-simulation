"use client"

import React, { useState, useEffect } from 'react';

interface NetlifyStats {
  cpu: number;
  memory: number;
  network: number;
}

export default function NetlifyStats() {
  const [stats, setStats] = useState<NetlifyStats>({
    cpu: 0,
    memory: 0,
    network: 0
  });
  
  useEffect(() => {
    // Simulated stats - in a real implementation we would fetch from Netlify API
    const updateStats = () => {
      setStats({
        cpu: Math.random() * 30, // 0-30% CPU usage
        memory: 100 + Math.random() * 150, // 100-250MB
        network: Math.random() * 5, // 0-5Mbps
      });
    };
    
    // Update every 2 seconds
    updateStats();
    const interval = setInterval(updateStats, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2 z-50 flex justify-center space-x-8 text-xs">
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        <span>CPU: {stats.cpu.toFixed(1)}%</span>
        <div className="w-24 h-2 bg-gray-700 ml-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500" 
            style={{ width: `${stats.cpu * 3.33}%` }} // Scale to make 30% fill the bar
          ></div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
        <span>RAM: {stats.memory.toFixed(1)}MB</span>
        <div className="w-24 h-2 bg-gray-700 ml-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500" 
            style={{ width: `${(stats.memory / 250) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
        <span>Network: {stats.network.toFixed(2)}Mbps</span>
        <div className="w-24 h-2 bg-gray-700 ml-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500" 
            style={{ width: `${(stats.network / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
} 