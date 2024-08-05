// auth0 import
import { useAuth0 } from "@auth0/auth0-react"
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import Profile from '../components/Profile'
//axios import
import axios from 'axios';
// animation import
import { motion } from "framer-motion";
// use effect
import { useEffect } from "react";
// logo import
//import logo from '../assets/mori.svg';

import { useNavigate } from 'react-router-dom';
import { auth0Callback } from '../services/api';

const FirstPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getIdTokenClaims } = useAuth0();

  
  useEffect(() => {
    async function checkProfileCompletion() {
      if (isAuthenticated) {
        try {
          const claims = await getIdTokenClaims();
          const userData = await auth0Callback({ id_token: claims.__raw });
          console.log(userData);
          if (!userData.profileCompleted) {
            navigate('/complete-profile');
          }
        } catch (error) {
          console.error('Error checking profile completion:', error);
        }
      }
    }
    checkProfileCompletion();
  }, [isAuthenticated, getIdTokenClaims, navigate]);

  useEffect(() => {
    async function sendTokenToBackend() {
      if (isAuthenticated) {
        try {
          const claims = await getIdTokenClaims();
          const id_token = claims.__raw;
          const response = await axios.post('http://localhost:5001/api/auth/auth0-callback', { id_token });
          console.log('User synchronized with backend:', response.data);
          console.log(response.data.user);
          
          // Salva i dati dell'utente nel localStorage
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        } catch (error) {
          console.error('Error syncing user with backend:', error);
        }
      }
    }
    sendTokenToBackend();
  }, [isAuthenticated, getIdTokenClaims]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center"
    >
      <motion.h1 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="text-3xl font-bold mb-4"
      >
        Welcome to our app!
      </motion.h1>
      {isAuthenticated ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <LogoutButton />
          <Profile />
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <LoginButton />
        </motion.div>
      )}
    </motion.div>
  );
};

export default FirstPage;