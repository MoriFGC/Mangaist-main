// src/components/Nav.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { IoMdHome } from "react-icons/io";
import { IoLibrary, IoPeople } from "react-icons/io5";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { BiSolidUser } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import { getUserById, getUserManga } from "../../services/api";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

export default function Nav({ children }) {
  const { user: auth0User, isAuthenticated, logout } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [userManga, setUserManga] = useState([]);
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

          // Assicurati che l'userId sia salvato nel localStorage
          localStorage.setItem("userId", storedUserData.id)

            // Fetch dei manga dell'utente
            const mangaResponse = await getUserManga(storedUserData.id);
            setUserManga(mangaResponse.data.filter((item) => item.manga !== null));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, auth0User]);

  const refreshUserData = useCallback(async () => {
    if (isAuthenticated && auth0User) {
      try {
        const storedUserData = JSON.parse(localStorage.getItem("userData"));
        if (storedUserData && storedUserData.id) {
          const response = await getUserById(storedUserData.id);
          setUserData(response.data);

          const mangaResponse = await getUserManga(storedUserData.id);
          setUserManga(mangaResponse.data.filter((item) => item.manga !== null));
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
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
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row flex-grow">
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
        <div className="flex-1 md:ml-64 flex flex-col">
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
          <main className="flex-grow p-4 pb-24 md:pb-4">
            {typeof children === 'function' ? children({ updateUserData }) : children}
          </main>
  
          {/* Aggiungiamo BottomNav qui */}
          <BottomNav userData={userData || auth0User} userManga={userManga} onNewContentCreated={refreshUserData} />
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}