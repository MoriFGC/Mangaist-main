import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    localStorage.removeItem('userData'); // Rimuovi i dati dell'utente dal localStorage
    logout({ returnTo: window.location.origin });
  };

  return (
    <button className='text-white' onClick={handleLogout}>
      LOGOUT
    </button>
  );
};

export default LogoutButton;