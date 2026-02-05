import { nanoid } from "nanoid";
import { useState, useEffect } from "react"; // added useEffect
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [filter, setFilter] = useState("All");
  // const apiURL = "http://localhost:8000";
  // const apiURL = "https://django-todo-backend-kj1d.onrender.com";
  const API_URL = import.meta.env.VITE_DJANGO_API_URL;

  // Added this
  useEffect(() => {
    if (!API_URL) {
      console.error("Missing VITE_DJANGO_API_URL env var");
      return;
    }

    fetch(`${API_URL}/todos/`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error:", error));
  }, []);

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

  const [tasks, setTasks] = useState([]); // tasks starts as an empty array and useffect will populate them from the API when the component
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
}

export default App;
