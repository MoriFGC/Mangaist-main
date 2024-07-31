import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
      Log Out
    </button>
  );
};

export default LogoutButton;