import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/mori3.svg";
import LoginButton from "../LoginButton";
import NavItem from "./NavItem";
import AnimatedIcon from "./AnimatedIcon"; // Importiamo AnimatedIcon invece di AnimatedSocialIcon

// Componente MobileNav
const MobileNav = ({ userData, navItems, socialItems, location }) => {
  // Stato per controllare l'apertura/chiusura del menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Funzione per aprire/chiudere il menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="relative w-full">
      <nav className="relative h-20 mx-auto max-w-7xl flex justify-between items-center px-4">
        {/* Profilo utente o pulsante di login */}
        <div className="order-1">
          {userData ? (
            // Se l'utente è loggato, mostra l'immagine del profilo
            <img
              src={userData.profileImage || userData.picture}
              alt={userData.name}
              className="w-12 h-12 rounded-lg"
            />
          ) : (
            // Se l'utente non è loggato, mostra il pulsante di login
            <LoginButton />
          )}
        </div>

        {/* Logo */}
        <div className="order-2 absolute left-1/2 transform -translate-x-1/2">
          <Link to="/home">
            <img src={logo} alt="logo" className="w-20" />
          </Link>
        </div>

        {/* Pulsante menu hamburger (mostrato solo se l'utente è loggato) */}
        {userData && (
          <div className="order-3">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none w-6 h-6 relative"
            >
              <motion.div
                animate={
                  isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                }
                className="w-6 h-0.5 bg-white absolute top-2"
              />
              <motion.div
                animate={isMenuOpen ? { rotate: -45 } : { rotate: 0 }}
                className="w-6 h-0.5 bg-white absolute bottom-2"
              />
            </button>
          </div>
        )}
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {userData && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Links di navigazione */}
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                href={item.href}
                icon={item.icon}
                name={item.name}
                isActive={location.pathname === item.href}
                onClick={() => {
                  setIsMenuOpen(false);
                  if (item.onClick) item.onClick();
                }}
              />
            ))}

            {/* Links ai social media */}
            <ul className="flex justify-around gap-4 py-4 px-4 m-5 mt-10">
              {socialItems.map((item, index) => (
                <li key={index}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <AnimatedIcon
                      icon={item.icon}
                      className="text-xl text-text hover:text-white"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MobileNav;

// Questo componente gestisce la navigazione mobile dell'applicazione.
// Utilizza AnimatedIcon per le icone social e NavItem per gli elementi di navigazione.
// Il menu mobile si apre e si chiude con un'animazione fluida grazie a Framer Motion.