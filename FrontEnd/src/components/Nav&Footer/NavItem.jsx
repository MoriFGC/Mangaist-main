import React, { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedIcon from "./AnimatedIcon";


const NavItem = ({ href, icon: Icon, name, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <>
      {Icon && (
        <AnimatedIcon 
          icon={Icon} 
          isHovered={isHovered} 
          className={`mr-3 text-lg transition-colors duration-200 ${
            isHovered ? 'text-blue-500' : 'text-white'
          }`} 
        />
      )}
      {name}
    </>
  );
  const sharedProps = {
    className: `flex items-center text-sm py-4 px-4 m-5 rounded-lg ${
      isActive ? "bg-button-bg text-white" : "text-text"
    }`,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onClick: onClick
  };

  return href ? (
    <Link to={href} {...sharedProps}>
      {content}
    </Link>
  ) : (
    <button {...sharedProps}>
      {content}
    </button>
  );
};

export default NavItem;

// Questo componente ora gestisce lo stato di hover e lo passa all'AnimatedIcon,
// permettendo l'animazione dell'icona quando si passa sopra l'intero elemento.