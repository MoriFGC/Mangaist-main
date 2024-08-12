import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/mori3.svg";
import DropdownProfile from "../DropdownProfile";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../LoginButton";
import { IoMdHome } from "react-icons/io";
import { IoLibrary, IoPeople } from "react-icons/io5";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function Nav() {
  const { user } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "/home", icon: IoMdHome },
    { name: "Library", href: "/library", icon: IoLibrary },
    { name: "Social", href: "/users", icon: IoPeople },
  ];

  const socialItems = [
    { name: "Instagram", href: "https://www.instagram.com/abdul.jsx?igsh=MWh3N3dpMTByZnlybg%3D%3D&utm_source=qr", icon: BiLogoInstagramAlt },
    { name: "GitHub", href: "https://github.com/MoriFGC", icon: FaGithub },
    { name: "Linkedin", href: "https://www.linkedin.com/in/abd-elrahman-mohamed-44278a30b/", icon: FaLinkedin },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Varianti per l'animazione dell'hamburger menu
  const topLineVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 50, y: 6 }
  };

  const bottomLineVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -50,}
  };
  return (
    <header className="relative w-full">
      <div className="absolute inset-0 bg-transparent bg-opacity-70 backdrop-blur-md"></div>

      <nav className="relative h-20 mx-auto max-w-7xl flex justify-between items-center px-4">
        {/* Immagine profilo a sinistra */}
        <div className="order-1">
          {user ? <DropdownProfile /> : <LoginButton />}
        </div>

        {/* Logo al centro */}
        <div className="order-2 absolute left-1/2 transform -translate-x-1/2">
        <Link to='/home'>
          <img src={logo} alt="logo" className="w-20" />
        </Link>
        </div>

        {/* Hamburger menu a destra */}
        <div className="order-3">
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none w-6 h-6 relative"
        >
          <motion.div
            variants={topLineVariants}
            initial="closed"
            animate={isMenuOpen ? "open" : "closed"}
            transition={{ duration: 0.5 }}
            className="w-6 h-0.5 bg-white absolute top-2"
          ></motion.div>
          <motion.div
            variants={bottomLineVariants}
            initial="closed"
            animate={isMenuOpen ? "open" : "closed"}
            transition={{ duration: 0.5 }}
            className="w-6 h-0.5 bg-white absolute bottom-2"
          ></motion.div>
        </button>
      </div>

        {/* Menu espanso */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0}}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute top-full left-0 right-0 bg-black overflow-hidden p-3" //todo coprire l'intera viewport
            >
              {navItems.map((item, index) => (
                <div className="bg-black p-3"
                 key={index}
                 >
                  <Link
                    
                    to={item.href}
                    className={`flex items-center text-sm py-4 px-4 rounded-lg ${
                      location.pathname === item.href ? "bg-button-bg text-white" : "text-text"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="mr-2" />}
                    {item.name}
                  </Link>
                </div>
              ))}
              <ul className="flex text-[#999999] justify-between mt-10 text-lg p-7">
                {socialItems.map((item, index) => (
                    <li
                     key={index}
                      >
                        <a href={item.href} alt={item.name} >{item.icon && <item.icon className="" />}</a>
                    </li>
                  ))}   
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
