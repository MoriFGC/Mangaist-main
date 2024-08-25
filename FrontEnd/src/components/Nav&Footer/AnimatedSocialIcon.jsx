import React, { useState } from "react";
import AnimatedIcon from "./AnimatedIcon";

const AnimatedSocialIcon = ({ href, icon, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatedIcon icon={icon} isHovered={isHovered} className={className} />
    </a>
  );
};

export default AnimatedSocialIcon;

// Questo componente gestisce l'hover per le icone social e utilizza AnimatedIcon
// per l'animazione.