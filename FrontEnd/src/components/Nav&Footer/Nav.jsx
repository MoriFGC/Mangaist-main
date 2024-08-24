import React, { useState, useEffect } from "react";
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
import { BiSolidUser } from "react-icons/bi";
import { getUserById } from "../../services/api";
import { MdLogout } from "react-icons/md";

// Componente NavItem per rendere il codice più DRY
const NavItem = ({ href, icon: Icon, name, isActive, onClick }) => {
  const content = (
    <>
      {Icon && <Icon className="mr-3 text-lg" />}
      {name}
    </>
  );

  if (href) {
    return (
      <Link
        to={href}
        className={`flex items-center text-sm py-4 px-4 m-5 rounded-lg ${
          isActive ? "bg-button-bg text-white" : "text-text"
        }`}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  } else {
    return (
      <button
        className={`flex items-center text-sm py-4 px-4 m-5 rounded-lg ${
          isActive ? "bg-button-bg text-white" : "text-text"
        }`}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }
};

// Componente Sidebar
const Sidebar = ({ userData, navItems, socialItems, location }) => (
  <div className="fixed left-0 top-0 h-full w-64 text-white p-5 flex flex-col border-r border-r-text/30">
    <div className="mb-8">
      <img src={logo} alt="logo" className="w-20 mx-auto" />
    </div>
    <div className="mb-8">
      {userData ? <DropdownProfile userData={userData} /> : <LoginButton />}
    </div>
    <nav className="flex-grow">
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          href={item.href}
          icon={item.icon}
          name={item.name}
          isActive={location.pathname === item.href}
          onClick={item.onClick} // Aggiungi questa riga
        />
      ))}
    </nav>
    <div className="mt-auto">
      <ul className="flex justify-between px-5 text-gray-400">
        {socialItems.map((item, index) => (
          <li key={index}>
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              <item.icon className="text-2xl hover:text-white" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// Componente MobileNav
const MobileNav = ({ userData, navItems, socialItems, location }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="relative w-full">
      <nav className="relative h-20 mx-auto max-w-7xl flex justify-between items-center px-4">
        {/* Profilo */}
        <div className="order-1">
          {userData ? <DropdownProfile userData={userData} /> : <LoginButton />}
        </div>
        {/* Logo */}
        <div className="order-2 absolute left-1/2 transform -translate-x-1/2">
          <Link to="/home">
            <img src={logo} alt="logo" className="w-20" />
          </Link>
        </div>
        {/* Toogle Menu */}
        <div className="order-3">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none w-6 h-6 relative"
          >
            <motion.div
              animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white absolute top-2"
            />
            <motion.div
              animate={isMenuOpen ? { rotate: -45 } : { rotate: 0 }}
              className="w-6 h-0.5 bg-white absolute bottom-2"
            />
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                href={item.href}
                icon={item.icon}
                name={item.name}
                isActive={location.pathname === item.href}
                onClick={() => {
                  setIsMenuOpen(false);
                  if (item.onClick) item.onClick(); // Aggiungi questa condizione
                }}
              />
            ))}
            <ul className="flex justify-around gap-4 py-4 px-4 m-5 mt-10">
              {socialItems.map((item, index) => (
                <li key={index}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <item.icon className="text-xl text-text hover:text-white" />
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

export default function Nav({ children }) {
  const { user: auth0User, isAuthenticated, logout } = useAuth0();
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && auth0User) {
        try {
          const storedUserData = JSON.parse(localStorage.getItem("userData"));
          if (storedUserData && storedUserData.id) {
            const response = await getUserById(storedUserData.id);
            setUserData(response.data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, auth0User]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    logout({ returnTo: window.location.origin });
  };

  const navItems = [
    { name: "Home", href: "/home", icon: IoMdHome },
    { name: "Library", href: "/library", icon: IoLibrary },
    { name: "Social", href: "/users", icon: IoPeople },
    { name: "Profile", href: `/profile/${userData?._id}`, icon: BiSolidUser },
    { name: "Logout", onClick: handleLogout, icon: MdLogout },
  ];
  const socialItems = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/abdul.jsx",
      icon: BiLogoInstagramAlt,
    },
    { name: "GitHub", href: "https://github.com/MoriFGC", icon: FaGithub },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/abd-elrahman-mohamed-44278a30b/",
      icon: FaLinkedin,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar (visibile da 810px in su) */}
      <div className="hidden md:block w-64 fixed h-full">
        <Sidebar
          userData={userData || auth0User}
          navItems={navItems}
          socialItems={socialItems}
          location={location}
        />
      </div>

      {/* Contenitore principale */}
      <div className="flex-1 md:ml-64">
        {/* Navigazione mobile (visibile fino a 809px) */}
        <div className="md:hidden">
          <MobileNav
            userData={userData || auth0User}
            navItems={navItems}
            socialItems={socialItems}
            location={location}
          />
        </div>

        {/* Outlet per il contenuto delle pagine */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
