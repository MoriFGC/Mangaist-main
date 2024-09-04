// NotFound.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import shocked from '../assets/shocked.jpg'

const NotFound = () => {
  // Definiamo le varianti per le animazioni
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        delay: 0.3, 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Titolo animato */}
      <motion.h1 
        className="text-6xl md:text-8xl font-bold mb-8"
        variants={itemVariants}
      >
        404
      </motion.h1>

      {/* Sottotitolo animato */}
      <motion.h2 
        className="text-2xl md:text-4xl mb-8 text-center"
        variants={itemVariants}
      >
        WHAT ARE YOU DOING HERE?!
      </motion.h2>

      {/* Immagine di un personaggio manga confuso */}
      <motion.img
        src={shocked} // Assicurati di avere questa immagine nel tuo progetto
        alt="Confused Manga Character"
        className="size-72 object-cover mb-8 rounded-lg"
        variants={itemVariants}
      />

      {/* Testo esplicativo animato */}
      <motion.p 
        className="text-xl mb-8 text-center max-w-md"
        variants={itemVariants}
      >
        OH NO! You've wandered into the forbidden realm of non-existent pages!<br></br> 
        This isn't safe for mere mortals like you!
      </motion.p>

      {/* Pulsante per tornare alla home */}
      <motion.div variants={itemVariants}>
        <Link 
          to="/" 
          className="bg-white text-black border border-transparent hover:bg-black hover:text-white hover:border-white  font-bold py-3 px-6 rounded-full flex items-center transition duration-300"
        >
          <FaHome className="mr-2 " />
          Back to Homepage
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;