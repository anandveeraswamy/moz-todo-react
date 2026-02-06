import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

/**
 * Private page component
 * Protected route - redirects to login if not authenticated
 */
export default function PrivateComponent() {
  const { isLoggedIn, username } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? (
    <h2>Welcome {username}! This is the private section for authenticated users</h2>
  ) : null;
}
