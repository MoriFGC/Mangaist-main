import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";

const Home = () => {
  const { isAuthenticated } = useAuth0();

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
          <Link to="/hello" className="mt-4 text-blue-500 hover:text-blue-700">Go to Hello World</Link>
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