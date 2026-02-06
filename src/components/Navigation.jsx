import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

/**
 * Navigation bar component
 * Shows different links based on authentication status
 */
export default function Navigation() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    console.log("Logout successful");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h1>
        <NavLink to="/">Django React Todo</NavLink>
      </h1>
      <ul className="nav-links">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
