import React from "react";
import { easeInOut, motion } from "framer-motion";

// Questo componente accetta un'icona e uno stato di hover come props
const AnimatedIcon = ({ icon: Icon, isHovered, className }) => {
  // Definiamo le varianti per l'animazione
  const iconVariants = {
    hover: { scale: 1.2, rotate: 5, transition: easeInOut },
    initial: { scale: 1, rotate: 0 }
  };

  return (
    <motion.div
      variants={iconVariants}
      animate={isHovered ? "hover" : "initial"}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Icon className={className} />
    </motion.div>
  );
};

export default AnimatedIcon;

// Nota: Questo componente ora dipende da uno stato di hover passato dal genitore,
// permettendoci di controllare l'animazione dall'esterno.