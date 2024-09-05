import { useState, useEffect } from 'react';

const useTypingEffect = (text, speed = 50, startTyping = true) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (startTyping && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex >= text.length) {
      setIsComplete(true);
    }
  }, [currentIndex, speed, text, startTyping]);

  const resetTyping = () => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  };

  return { displayedText, isComplete, resetTyping };
};

export default useTypingEffect;