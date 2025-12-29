import { useState } from "react";
import { useData } from "../context/DataContext";
import TaskDrawer from "../components/TaskDrawer";
import type { Task } from "@eisenhower/shared";

const COLORS = [
  "#ef4444",
  "#22c55e",
  "#f97316",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#facc15",
  "#64748b",
  "#0f172a",
];
const COLOR_NAMES: Record<string, string> = {
  "#ef4444": "Red",
  "#22c55e": "Green",
  "#f97316": "Orange",
  "#3b82f6": "Blue",
  "#8b5cf6": "Purple",
  "#ec4899": "Pink",
  "#14b8a6": "Teal",
  "#facc15": "Yellow",
  "#64748b": "Gray",
  "#0f172a": "Dark",
};

const QUADRANT_LABELS: Record<string, string> = {
  do: "Do",
  decide: "Schedule",
  delegate: "Delegate",
  delete: "Eliminate",
};

export default function Todos() {
  const { tasks, addTask, updateTask, deleteTask, loading } = useData();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const grouped = tasks.reduce(
    (acc, task) => {
      if (!acc[task.color]) acc[task.color] = [];
      acc[task.color].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
  );

  const sortedColors = COLORS.filter((c) => grouped[c]);

  const handleAddTask = () => {
    const newTask = addTask({
      title: "",
      note: "",
      tags: [],
      color: COLORS[0],
      q: null,
      completed: false,
    });
    setActiveTask(newTask);
  };

  const handleToggleComplete = (task: Task) => {
    updateTask(task.id, { completed: !task.completed });
  };

  const handleUpdate = (updates: Partial<Task>) => {
    if (activeTask) {
      updateTask(activeTask.id, updates);
      setActiveTask({ ...activeTask, ...updates });
    }
  };

  const handleDelete = () => {
    if (activeTask) {
      deleteTask(activeTask.id);
      setActiveTask(null);
    }
  };

  if (loading) {
    return (
      <>
        <header>
          <h1>Todos</h1>
        </header>
        <div className="empty-state">Loading...</div>
      </>
    );
  }

  return (
    <>
      <header>
        <h1>Todos</h1>
      </header>

      <div className="todo-container">
        <div className="todo-groups">
          {sortedColors.length === 0 ? (
            <div className="empty-state">
              No todos yet. Add one to get started!
            </div>
          ) : (
            sortedColors.map((color) => (
              <div key={color} className="todo-group">
                <div className="todo-group-header">
                  <span
                    className="todo-group-dot"
                    style={{ background: color }}
                  ></span>
                  <span>{COLOR_NAMES[color] || "Other"}</span>
                </div>
                <div className="todo-list">
                  {grouped[color].map((task) => (
                    <div
                      key={task.id}
                      className={`todo-item ${task.completed ? "completed" : ""}`}
                      onClick={() => setActiveTask(task)}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleToggleComplete(task)}
                      />
                      <span>{task.title || "Untitled"}</span>
                      {task.q && (
                        <span className={`quadrant-badge q-${task.q}`}>
                          {QUADRANT_LABELS[task.q]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <button className="add-todo-btn" onClick={handleAddTask}>
          + Add Todo
        </button>
      </div>

      <TaskDrawer
        task={activeTask}
        onClose={() => setActiveTask(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        showQuadrant={true}
      />
    </>
  );
}
