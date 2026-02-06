import { useAuth } from "../AuthContext";

/**
 * Home page component
 * Displays welcome message based on authentication status
 */
export default function Home() {
  const { isLoggedIn, username } = useAuth();

  return (
    <h2>
      {isLoggedIn
        ? `Welcome, ${username}! You're logged in.`
        : "Hi, please log in (or register) to use the site"}
    </h2>
  );
}
