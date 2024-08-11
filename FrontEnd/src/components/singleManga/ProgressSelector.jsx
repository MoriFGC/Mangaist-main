import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const AutoScrollingList = ({ children, className }) => {
  const scrollRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      setShouldAnimate(scrollWidth > clientWidth);
    }
  }, [children]);

  useEffect(() => {
    if (shouldAnimate && scrollRef.current) {
      const animate = async () => {
        await controls.start({
          x: [-scrollRef.current.scrollWidth / 2, 0],
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          },
        });
      };
      animate();
    }
  }, [shouldAnimate, controls]);

  const handleMouseEnter = () => {
    controls.stop();
  };

  const handleMouseLeave = () => {
    if (shouldAnimate && scrollRef.current) {
      controls.start({
        x: [-scrollRef.current.scrollWidth / 2, 0],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        },
      });
    }
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        ref={scrollRef}
        className="flex"
        animate={controls}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        {shouldAnimate && children}
      </motion.div>
    </div>
  );
};

export default AutoScrollingList;