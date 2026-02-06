import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { Register, Login } from "./components/Authentication";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
import TodoApp from "./components/TodoApp";

/**
 * AppContent component
 * Contains the main routing logic
 * Uses useAuth hook to conditionally render protected routes
 */
const AppContent = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="App">
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todos" element={<TodoApp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </div>
  );
};

/**
 * App component
 * Root component that wraps the app with AuthProvider and Router
 */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
