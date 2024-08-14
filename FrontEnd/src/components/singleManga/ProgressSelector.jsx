import React from 'react';
import { motion } from 'framer-motion';

const ProgressSelector = ({ label, current, max, onChange }) => {
  const handleItemClick = (number) => {
    onChange(number);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: max }, (_, index) => {
          const itemNumber = index + 1;
          const isRead = itemNumber <= current;
          return (
            <motion.button
              key={itemNumber}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                isRead ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleItemClick(itemNumber)}
            >
              {itemNumber}
            </motion.button>
          );
        })}
      </div>
      <p className="text-sm text-gray-400 mt-2">Current: {current} / {max}</p>
    </div>
  );
};

export default ProgressSelector;