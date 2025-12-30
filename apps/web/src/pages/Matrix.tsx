import { useState, useRef } from 'react'
import { useData } from '../context/DataContext'
import TaskDrawer from '../components/TaskDrawer'
import type { Task } from '@eisenhower/shared'

type Quadrant = 'do' | 'decide' | 'delegate' | 'delete' | 'unassigned'

const QUADRANTS: { id: Quadrant; title: string; subtitle: string; color: string }[] = [
  { id: 'do', title: 'Important & Urgent', subtitle: 'Do First', color: 'red' },
  { id: 'decide', title: 'Important & Not Urgent', subtitle: 'Schedule', color: 'green' },
  { id: 'delegate', title: 'Not Important & Urgent', subtitle: 'Delegate', color: 'orange' },
  { id: 'delete', title: 'Not Important & Not Urgent', subtitle: 'Eliminate', color: 'blue' },
]

export default function Matrix() {
  const { tasks, updateTask, deleteTask, loading } = useData()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [dragOverQuadrant, setDragOverQuadrant] = useState<Quadrant | null>(null)
  const dragRef = useRef<string | null>(null)

  const getTasksByQuadrant = (q: Quadrant) => {
    if (q === 'unassigned') {
      return tasks.filter(t => !t.q)
    }
    return tasks.filter(t => t.q === q)
  }

  const handleDragStart = (taskId: string, task: Task) => {
    dragRef.current = taskId
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent, quadrant: Quadrant) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverQuadrant(quadrant)
  }

  const handleDrop = (quadrant: Quadrant) => {
    if (dragRef.current) {
      const newQ = quadrant === 'unassigned' ? null : quadrant
      updateTask(dragRef.current, { q: newQ })
      dragRef.current = null
      setDraggedTask(null)
      setDragOverQuadrant(null)
    }
  }

  const handleDragEnd = () => {
    dragRef.current = null
    setDraggedTask(null)
    setDragOverQuadrant(null)
  }

  const handleToggleComplete = (task: Task) => {
    updateTask(task.id, { completed: !task.completed })
  }

  const handleUpdate = (updates: Partial<Task>) => {
    if (activeTask) {
      updateTask(activeTask.id, updates)
      setActiveTask({ ...activeTask, ...updates })
    }
  }

  const handleDelete = () => {
    if (activeTask) {
      deleteTask(activeTask.id)
      setActiveTask(null)
    }
  }

  const renderTask = (task: Task) => (
    <div
      key={task.id}
      className={`task ${task.completed ? 'completed' : ''} ${draggedTask?.id === task.id ? 'dragging' : ''}`}
      draggable
      onDragStart={() => handleDragStart(task.id, task)}
      onDragEnd={handleDragEnd}
      onClick={() => setActiveTask(task)}
    >
      <span className="drag-handle">⋮⋮</span>
      <input
        type="checkbox"
        checked={task.completed}
        onClick={(e) => e.stopPropagation()}
        onChange={() => handleToggleComplete(task)}
      />
      <div className="task-color" style={{ background: task.color }}></div>
      <span>{task.title || 'Untitled'}</span>
    </div>
  )

  if (loading) {
    return (
      <>
        <header><h1>Eisenhower Matrix</h1></header>
        <div className="empty-state">Loading...</div>
      </>
    )
  }

  return (
    <>
      <header><h1>Eisenhower Matrix</h1></header>

      <div className="matrix-layout">
        <div className="unassigned-column">
          <div
            className={`card ${dragOverQuadrant === 'unassigned' ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, 'unassigned')}
            onDragLeave={() => setDragOverQuadrant(null)}
            onDrop={() => handleDrop('unassigned')}
          >
            <div className="card-header gray">
              Unassigned
              <small>Drag tasks here</small>
            </div>
            <div className="tasks">
              {getTasksByQuadrant('unassigned').map(renderTask)}
            </div>
          </div>
        </div>

        <div className="matrix">
          {QUADRANTS.map(q => (
            <div
              key={q.id}
              className={`card ${dragOverQuadrant === q.id ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, q.id)}
              onDragLeave={() => setDragOverQuadrant(null)}
              onDrop={() => handleDrop(q.id)}
            >
              <div className={`card-header ${q.color}`}>
                {q.title}
                <small>{q.subtitle}</small>
              </div>
              <div className="tasks">
                {getTasksByQuadrant(q.id).map(renderTask)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskDrawer
        task={activeTask}
        onClose={() => setActiveTask(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        showQuadrant={false}
      />
    </>
  )
}
