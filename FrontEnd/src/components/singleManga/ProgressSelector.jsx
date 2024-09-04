import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProgressSelector = ({ label, current, max, onChange }) => {
  const [activeTab, setActiveTab] = useState('chapters');

  // Funzione per gestire il click su un elemento
  const handleItemClick = (type, number) => {
    onChange(type, number);
  };

  // Funzione per generare i cerchi
  const generateCircles = (type) => (
    <div className="flex flex-wrap gap-2 overflow-y-auto h-64 p-2 scrollbar-thin">
      {Array.from({ length: max[type] }, (_, index) => {
        const itemNumber = index + 1;
        const isRead = itemNumber <= current[type];
        return (
          <motion.button
            key={itemNumber}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
              isRead ? 'bg-white text-black font-semibold' : 'bg-button-bg text-gray-300'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleItemClick(type, itemNumber)}
          >
            {itemNumber}
          </motion.button>
        );
      })}
    </div>
  );

  // Layout per desktop
  const desktopLayout = (
    <div className="hidden md:flex gap-4">
      <div className="w-1/2">
        <h4 className="text-lg font-semibold text-white mb-2">Chapters</h4>
        {generateCircles('chapters')}
      </div>
      <div className="w-1/2">
        <h4 className="text-lg font-semibold text-white mb-2">Volumes</h4>
        {generateCircles('volumes')}
      </div>
    </div>
  );

  // Layout per mobile
  const mobileLayout = (
    <div className="md:hidden">
      <div className="flex justify-around border-b border-gray-700 mb-4">
        <button
          className={`flex-1 py-2 ${activeTab === 'chapters' ? 'border-b-2 border-white text-white' : 'text-gray-400'}`}
          onClick={() => setActiveTab('chapters')}
        >
          Chapters
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === 'volumes' ? 'border-b-2 border-white text-white' : 'text-gray-400'}`}
          onClick={() => setActiveTab('volumes')}
        >
          Volumes
        </button>
      </div>
      {generateCircles(activeTab)}
    </div>
  );

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-2">{label}</h3>
      {desktopLayout}
      {mobileLayout}
      <p className="text-sm text-gray-400 mt-2">
        Current: {current[activeTab]} / {max[activeTab]} {activeTab === 'chapters' ? 'Chapters' : 'Volumes'}
      </p>
    </div>
  );
};

export default ProgressSelector;