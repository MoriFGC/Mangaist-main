import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const HelloWorld = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return <Link to="/" className="text-blue-500 hover:text-blue-700">Please log in</Link>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Hello World!</h1>
      <p>Logged: {user.name}</p>
      <Link to="/" className="mt-4 text-blue-500 hover:text-blue-700">Back to Home</Link>
    </div>
  );
};

export default HelloWorld;