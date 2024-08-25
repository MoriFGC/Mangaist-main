import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/mori3.svg";
import LoginButton from "./LoginButton";
import NavItem from "./NavItem";  // Importiamo NavItem
import AnimatedSocialIcon from "./AnimatedSocialIcon";

const Sidebar = ({ userData, navItems, socialItems, location }) => (
  <div className="fixed left-0 top-0 h-full w-64 text-white p-5 flex flex-col border-r border-r-text/30">
    {/* Logo */}
    <div className="mb-8">
      <img src={logo} alt="logo" className="w-20 mx-auto" />
    </div>

    {/* Profilo utente o pulsante di login */}
    <div className="mb-8">
      {userData ? (
        <img
          src={userData.profileImage || userData.picture}
          alt={userData.name}
          className="w-52 h-52 rounded-lg mx-auto"
        />
      ) : (
        <div className="flex justify-center">
          <LoginButton />
        </div>
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
            isActive={location.pathname === item.href}
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

export default Sidebar;