import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css";

const API_URL = "http://localhost:8080/api/tasks";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  
  // Fetch tasks from backend
  useEffect(() => {
    axios.get(API_URL).then((response) => setTasks(response.data));
  }, []);

  // Add a new task
  const addTask = () => {
    if (newTask.trim() === "") return;
    axios.post(API_URL, { description: newTask, completed: false }).then((response) => {
      setTasks([...tasks, response.data]);
      setNewTask("");
    });
  };

  // Delete a task
  const deleteTask = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  // Toggle task completion
  const toggleCompletion = (id) => {
    const task = tasks.find((task) => task.id === id);
    axios
      .put(`${API_URL}/${id}`, { ...task, completed: !task.completed })
      .then((response) => {
        setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
      });
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>
      <div className="input-section">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <span onClick={() => toggleCompletion(task.id)}>{task.description}</span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
