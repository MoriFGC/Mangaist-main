import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import Profile from '../components/Profile'
import axios from 'axios';
import { useEffect } from "react";

const Home = () => {
  const { isAuthenticated, getIdTokenClaims, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    async function sendTokenToBackend() {
      if (isAuthenticated) {
        try {
          const claims = await getIdTokenClaims();
          const id_token = claims.__raw;
          const response = await axios.post('http://localhost:5001/api/auth/auth0-callback', { id_token });
          console.log('User synchronized with backend:', response.data);
        } catch (error) {
          console.error('Error syncing user with backend:', error);
        }
      }
    }
    sendTokenToBackend();
  }, [isAuthenticated, getIdTokenClaims]);

  const { user } = useAuth0();
  console.log(user);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen"
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

export default Home;