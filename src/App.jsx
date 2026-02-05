import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { Register, Login } from "./components/Authentication";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

const Home = () => {
  const { isLoggedIn, username } = useAuth();
  return (
    <h2>
      {isLoggedIn
        ? `Welcome, ${username}! You're logged in.`
        : "Hi, please log in (or register) to use the site"}
    </h2>
  );
};

const PrivateComponent = () => {
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
};

const Navigation = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    console.log("Logout successful");
    navigate("/");
  };

  return (
    <nav>
      <h1>
        <NavLink to="/">Django+React Todo</NavLink>
      </h1>
      <ul>
        <li>
          <NavLink to="/todos">Todos</NavLink>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <NavLink to="/private">Private</NavLink>
            </li>
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
};

const TodoApp = () => {
  const [filter, setFilter] = useState("All");
  const [tasks, setTasks] = useState([]);
  const API_URL = import.meta.env.VITE_DJANGO_API_URL;

  useEffect(() => {
    if (!API_URL) {
      console.error("Missing VITE_DJANGO_API_URL env var");
      return;
    }

    fetch(`${API_URL}/todos/`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error:", error));
  }, [API_URL]);

  function toggleTaskCompleted(id) {
    const task = tasks.find((t) => t.id === id);
    fetch(`${API_URL}/todos/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      })
      .catch((error) => console.error("Error:", error));
  }

  function deleteTask(id) {
    fetch(`${API_URL}/todos/${id}/`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter((task) => id !== task.id)))
      .catch((error) => console.error("Error:", error));
  }

  function editTask(id, newName) {
    fetch(`${API_URL}/todos/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      })
      .catch((error) => console.error("Error:", error));
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(name) {
    fetch(`${API_URL}/todos/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, completed: false }),
    })
      .then((response) => response.json())
      .then((newTask) => setTasks([...tasks, newTask]))
      .catch((error) => console.error("Error:", error));
  }

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
};

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
        {isLoggedIn && <Route path="/private" element={<PrivateComponent />} />}
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </div>
  );
};

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
