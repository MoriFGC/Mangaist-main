import { useAuth0 } from "@auth0/auth0-react";
import { Button, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function DropdownProfile() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    logout({ returnTo: window.location.origin });
  };

  const dropdownItems = [
    { name: "Profile", to: "/profile" },
    { name: "Settings", to: "/settings" },
  ];

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <Menu>
        {({ open }) => (
          <>
            <MenuButton className="rounded-lg w-12">
              {user && user.picture ? (
                <img
                  className="rounded-lg"
                  src={user.picture}
                  alt={user.name}
                />
              ) : (
                <div>Immagine non disponibile</div>
              )}
            </MenuButton>
            <AnimatePresence>
              {open && (
                <MenuItems
                  static
                  as={motion.div}
                  initial={{ opacity: 0, scale: 0.95, x: -120 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  anchor="bottom"
                  className="origin-top bg-button-bg text-white rounded-lg shadow-lg w-28 p-4 ms-4 mt-8 flex flex-col"
                >
                  {dropdownItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      className={`text-sm p-2 rounded-md ${
                        location.pathname === item.to ? "bg-button-bg text-white" : "text-text"
                      }`}
                    >
                      <Link to={item.to} className="block w-full h-full">
                        {item.name}
                      </Link>
                    </MenuItem>
                  ))}
                  <MenuItem
                    as='span'
                    className="text-sm p-2 rounded-md text-text"
                    onClick={handleLogout}
                  >
                    Logout
                  </MenuItem>
                </MenuItems>
              )}
            </AnimatePresence>
          </>
        )}
      </Menu>
    )
  );
}