import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InfiniteCharacterScroll = ({ characters }) => {
  const [scrollSpeed, setScrollSpeed] = useState(20); // Velocità normale
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollWidth = container.scrollWidth;
    const viewWidth = container.offsetWidth;

    const animate = () => {
      if (container.scrollLeft >= scrollWidth - viewWidth) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(animate, scrollSpeed);

    return () => clearInterval(intervalId);
  }, [scrollSpeed]);

  return (
    <div 
      ref={containerRef} 
      className="overflow-hidden whitespace-nowrap"
      onMouseEnter={() => setScrollSpeed(60)} // Rallenta
      onMouseLeave={() => setScrollSpeed(20)} // Velocità normale
    >
      <motion.div className="inline-flex">
        {characters.concat(characters).map((character, index) => (
          <motion.div
            key={index}
            className="w-48 mx-2 inline-block relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 rounded-lg"
                >
                  <p className="text-white text-sm max-h-full whitespace-normal">
                    {character.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-white text-center mt-2">{character.name}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteCharacterScroll;