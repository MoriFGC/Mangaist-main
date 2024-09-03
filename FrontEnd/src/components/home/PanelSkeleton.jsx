// src/components/home/PanelSkeleton.jsx
import React from 'react';

const PanelSkeleton = () => {
  return (
    <div className="bg-black rounded-none overflow-hidden shadow-lg border-b border-white/30 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center p-4">
        <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </div>

      {/* Image skeleton */}
      <div className="w-full h-[400px] bg-gray-700"></div>

      {/* Interactions skeleton */}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 bg-gray-700 rounded-full mr-4"></div>
          <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
        </div>
        <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-1"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default PanelSkeleton;