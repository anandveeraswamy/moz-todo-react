import { useEffect, useState } from "react";

/**
 * Custom hook for managing todo items and API interactions
 * Handles all fetch operations: GET, POST, PATCH, DELETE
 */
export function useTodos() {
  const [tasks, setTasks] = useState([]);
  const API_URL = import.meta.env.VITE_DJANGO_API_URL;

  // Fetch all todos on component mount
  useEffect(() => {
    if (!API_URL) {
      console.error("Missing VITE_DJANGO_API_URL env var");
      return;
    }

    fetch(`${API_URL}/todos/`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, [API_URL]);

  // Toggle task completion status
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
      .catch((error) => console.error("Error updating task:", error));
  }

  // Delete a task
  function deleteTask(id) {
    fetch(`${API_URL}/todos/${id}/`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter((task) => id !== task.id)))
      .catch((error) => console.error("Error deleting task:", error));
  }

  // Edit task name
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
      .catch((error) => console.error("Error editing task:", error));
  }

  // Add a new task
  function addTask(name) {
    fetch(`${API_URL}/todos/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, completed: false }),
    })
      .then((response) => response.json())
      .then((newTask) => setTasks([...tasks, newTask]))
      .catch((error) => console.error("Error adding task:", error));
  }

  return {
    tasks,
    toggleTaskCompleted,
    deleteTask,
    editTask,
    addTask,
  };
}
