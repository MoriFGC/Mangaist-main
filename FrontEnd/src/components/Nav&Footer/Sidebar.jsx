// Sidebar.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/mori3.svg";
import LoginButton from "./LoginButton";
import NavItem from "./NavItem";
import AnimatedSocialIcon from "./AnimatedSocialIcon";

const Sidebar = ({ userData, navItems, socialItems }) => {
  const currentLocation = useLocation();
  const isProfilePage = currentLocation.pathname.includes('/profile');

  return (
    <div className="fixed left-0 top-0 h-full w-64 text-white p-5 flex flex-col border-r border-r-text/30">
      {/* Logo o Profilo utente */}
      <div className="mb-8">
        {isProfilePage ? (
          // Se siamo nella pagina del profilo, mostra un logo più grande
          <img src={logo} alt="logo" className="w-40 h-40 mx-auto" />
        ) : (
          // Altrimenti, mostra il logo normale o l'immagine del profilo/pulsante di login
          userData ? (
            <img
              src={userData.profileImage || userData.picture}
              alt={userData.name}
              className="w-52 h-52 rounded-lg mx-auto"
            />
          ) : (
            <>
              <img src={logo} alt="logo" className="w-20 mx-auto mb-4" />
              <div className="flex justify-center">
                <LoginButton />
              </div>
            </>
          )
        )}
      </div>

      {/* Links di navigazione */}
      {userData && (
        <nav className="flex-grow">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              href={item.href}
              icon={item.icon}
              name={item.name}
              isActive={currentLocation.pathname === item.href}
              onClick={item.onClick}
            />
          ))}
        </nav>
      )}

      {/* Links ai social media */}
      <div className="mt-auto">
        <ul className="flex justify-between px-5 text-gray-400">
          {socialItems.map((item, index) => (
            <li key={index}>
              <AnimatedSocialIcon
                href={item.href}
                icon={item.icon}
                className="text-2xl hover:text-blue-500"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;