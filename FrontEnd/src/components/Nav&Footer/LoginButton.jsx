import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'framer-motion';
import { FaSignInAlt } from 'react-icons/fa';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <motion.button
      className='flex items-center justify-center border border-transparent bg-white text-black hover:bg-black hover:border-white hover:text-white active:bg-white/50 px-4 py-2 rounded-full transition-all duration-300'
      onClick={() => loginWithRedirect()}
    >
      <FaSignInAlt className="mr-2" />
      Login
    </motion.button>
  );
};

export default LoginButton;