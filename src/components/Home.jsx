import { useAuth } from "../AuthContext";

/**
 * Home page component
 * Displays welcome message based on authentication status
 */
export default function Home() {
  const { isLoggedIn, username } = useAuth();

  return (
    <div className="todoapp stack-large">
      <h1>Django React Todo</h1>
      <div className="label__lg">
        {isLoggedIn ? (
          <>
            <p>Welcome back, <strong>{username}</strong>! 🎉</p>
            <p>You're successfully logged in.</p>
          </>
        ) : (
          <>
            <p>Welcome to TodoMatic! ✨</p>
            <p>Please log in or register to manage your todos.</p>
          </>
        )}
      </div>
    </div>
  );
}
