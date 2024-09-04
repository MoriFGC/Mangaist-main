// PanelGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PanelGrid = ({ panels }) => {
  // ----- RENDERING -----
  return (
    <div className="grid grid-cols-3 gap-2">
      {panels && panels.map((panel) => (
        <Link to={`/panel/${panel._id}`} key={panel._id}>
          <motion.div
            className="relative overflow-hidden shadow-lg"
            style={{ aspectRatio: "2/3" }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={panel.panelImage}
              alt={`Panel from ${panel.manga?.title || 'Unknown manga'}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
              <p className="text-xs font-semibold text-white truncate">
                {panel.manga?.title || 'Unknown manga'}
              </p>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default PanelGrid;