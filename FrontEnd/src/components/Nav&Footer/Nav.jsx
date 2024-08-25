// src/components/Nav.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { IoMdHome } from "react-icons/io";
import { IoLibrary, IoPeople } from "react-icons/io5";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { BiSolidUser } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import { getUserById } from "../../services/api";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function Nav({ children }) {
  const { user: auth0User, isAuthenticated, logout } = useAuth0();
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  // Effetto per recuperare i dati dell'utente all'avvio e quando cambia l'autenticazione
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

  // Funzione per aggiornare i dati dell'utente, inclusa l'immagine del profilo
  const updateUserData = (newData) => {
    setUserData(prevData => ({ ...prevData, ...newData }));
  };

  // Funzione per gestire il logout
  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    logout({ returnTo: window.location.origin });
  };

  // Definizione degli elementi di navigazione
  const navItems = [
    { name: "Home", href: "/home", icon: IoMdHome },
    { name: "Library", href: "/library", icon: IoLibrary },
    { name: "Social", href: "/users", icon: IoPeople },
    { name: "Profile", href: `/profile/${userData?._id}`, icon: BiSolidUser },
    { name: "Logout", onClick: handleLogout, icon: MdLogout },
  ];

  // Definizione dei link ai social media
  const socialItems = [
    { name: "Instagram", href: "https://www.instagram.com/abdul.jsx", icon: BiLogoInstagramAlt },
    { name: "GitHub", href: "https://github.com/MoriFGC", icon: FaGithub },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/abd-elrahman-mohamed-44278a30b/", icon: FaLinkedin },
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
        <main className="p-4">{typeof children === 'function' ? children({ updateUserData }) : children}</main>
      </div>
    </div>
  );
}