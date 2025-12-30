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
  const { tasks, updateTask, deleteTask, reorderTasks, loading } = useData()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [dragOverQuadrant, setDragOverQuadrant] = useState<Quadrant | null>(null)
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null)
  const [dragOverEnd, setDragOverEnd] = useState<Quadrant | null>(null)
  const dragRef = useRef<string | null>(null)
  const dragCounterRef = useRef<Record<string, number>>({})

  const getTasksByQuadrant = (q: Quadrant) => {
    if (q === 'unassigned') {
      return tasks.filter(t => !t.q)
    }
    return tasks.filter(t => t.q === q)
  }

  const handleDragStart = (e: React.DragEvent, taskId: string, task: Task) => {
    dragRef.current = taskId
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', taskId)
    setTimeout(() => {
      (e.target as HTMLElement).classList.add('dragging')
    }, 0)
  }

  const handleDragOver = (e: React.DragEvent, quadrant: Quadrant) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverQuadrant(quadrant)
  }

  const handleDrop = (quadrant: Quadrant) => {
    if (dragRef.current && draggedTask) {
      const newQ = quadrant === 'unassigned' ? null : quadrant
      const currentQ = draggedTask.q
      
      // If dropping on the same quadrant (not on a specific task), move to end
      if ((currentQ === newQ) || (currentQ === null && quadrant === 'unassigned')) {
        // Same quadrant, reorder to end
        const quadrantTasks = getTasksByQuadrant(quadrant)
        const otherTasks = tasks.filter(t => {
          if (quadrant === 'unassigned') return t.q !== null
          return t.q !== quadrant
        })
        const reorderedQuadrantTasks = quadrantTasks.filter(t => t.id !== draggedTask.id)
        reorderedQuadrantTasks.push(draggedTask)
        const newOrder = [...otherTasks, ...reorderedQuadrantTasks].map(t => t.id)
        reorderTasks(newOrder)
      } else {
        // Different quadrant
        updateTask(dragRef.current, { q: newQ })
      }
      
      resetDragState()
    }
  }

  const handleTaskDragEnter = (e: React.DragEvent, taskId: string) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current[taskId] = (dragCounterRef.current[taskId] || 0) + 1
    if (draggedTask && draggedTask.id !== taskId) {
      setDragOverTaskId(taskId)
    }
  }

  const handleTaskDragLeave = (e: React.DragEvent, taskId: string) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current[taskId] = (dragCounterRef.current[taskId] || 0) - 1
    if (dragCounterRef.current[taskId] <= 0) {
      dragCounterRef.current[taskId] = 0
      if (dragOverTaskId === taskId) {
        setDragOverTaskId(null)
      }
    }
  }

  const handleTaskDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleTaskDrop = (e: React.DragEvent, targetTask: Task, quadrant: Quadrant) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedTask || draggedTask.id === targetTask.id) {
      resetDragState()
      return
    }

    const targetQ = quadrant === 'unassigned' ? null : quadrant
    const quadrantTasks = getTasksByQuadrant(quadrant)
    const otherTasks = tasks.filter(t => {
      if (quadrant === 'unassigned') return t.q !== null
      return t.q !== quadrant
    })

    // Remove dragged task from its current position
    const filteredQuadrantTasks = quadrantTasks.filter(t => t.id !== draggedTask.id)
    
    // Find target index and insert
    const targetIndex = filteredQuadrantTasks.findIndex(t => t.id === targetTask.id)
    
    // Update the dragged task's quadrant if needed
    const updatedDraggedTask = { ...draggedTask, q: targetQ }
    
    // Insert at target position
    filteredQuadrantTasks.splice(targetIndex, 0, updatedDraggedTask as Task)
    
    // Build new order
    const newOrder = [...otherTasks, ...filteredQuadrantTasks].map(t => t.id)
    
    // Update quadrant if changed, then reorder
    if (draggedTask.q !== targetQ) {
      updateTask(draggedTask.id, { q: targetQ })
    }
    reorderTasks(newOrder)
    
    resetDragState()
  }

  const handleEndDragEnter = (e: React.DragEvent, quadrant: Quadrant) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current[`end-${quadrant}`] = (dragCounterRef.current[`end-${quadrant}`] || 0) + 1
    if (draggedTask) {
      setDragOverEnd(quadrant)
    }
  }

  const handleEndDragLeave = (e: React.DragEvent, quadrant: Quadrant) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current[`end-${quadrant}`] = (dragCounterRef.current[`end-${quadrant}`] || 0) - 1
    if (dragCounterRef.current[`end-${quadrant}`] <= 0) {
      dragCounterRef.current[`end-${quadrant}`] = 0
      if (dragOverEnd === quadrant) {
        setDragOverEnd(null)
      }
    }
  }

  const handleEndDrop = (e: React.DragEvent, quadrant: Quadrant) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedTask) {
      resetDragState()
      return
    }

    const targetQ = quadrant === 'unassigned' ? null : quadrant
    const quadrantTasks = getTasksByQuadrant(quadrant)
    const otherTasks = tasks.filter(t => {
      if (quadrant === 'unassigned') return t.q !== null
      return t.q !== quadrant
    })

    // Remove dragged task and add to end
    const filteredQuadrantTasks = quadrantTasks.filter(t => t.id !== draggedTask.id)
    const updatedDraggedTask = { ...draggedTask, q: targetQ }
    filteredQuadrantTasks.push(updatedDraggedTask as Task)

    const newOrder = [...otherTasks, ...filteredQuadrantTasks].map(t => t.id)

    if (draggedTask.q !== targetQ) {
      updateTask(draggedTask.id, { q: targetQ })
    }
    reorderTasks(newOrder)

    resetDragState()
  }

  const resetDragState = () => {
    dragRef.current = null
    setDraggedTask(null)
    setDragOverQuadrant(null)
    setDragOverTaskId(null)
    setDragOverEnd(null)
    dragCounterRef.current = {}
  }

  const handleDragEnd = () => {
    resetDragState()
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

  const renderTask = (task: Task, quadrant: Quadrant) => (
    <div
      key={task.id}
      className={`task ${task.completed ? 'completed' : ''} ${draggedTask?.id === task.id ? 'dragging' : ''} ${dragOverTaskId === task.id ? 'drag-over' : ''}`}
      draggable
      onDragStart={(e) => handleDragStart(e, task.id, task)}
      onDragEnd={handleDragEnd}
      onDragEnter={(e) => handleTaskDragEnter(e, task.id)}
      onDragLeave={(e) => handleTaskDragLeave(e, task.id)}
      onDragOver={handleTaskDragOver}
      onDrop={(e) => handleTaskDrop(e, task, quadrant)}
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

  const renderQuadrantContent = (quadrant: Quadrant) => {
    const quadrantTasks = getTasksByQuadrant(quadrant)
    return (
      <>
        <div className="tasks">
          {quadrantTasks.map(task => renderTask(task, quadrant))}
        </div>
        {quadrantTasks.length > 0 && (
          <div
            className={`tasks-drop-end ${dragOverEnd === quadrant ? 'drag-over' : ''}`}
            onDragEnter={(e) => handleEndDragEnter(e, quadrant)}
            onDragLeave={(e) => handleEndDragLeave(e, quadrant)}
            onDragOver={handleTaskDragOver}
            onDrop={(e) => handleEndDrop(e, quadrant)}
          />
        )}
      </>
    )
  }

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
            {renderQuadrantContent('unassigned')}
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
              {renderQuadrantContent(q.id)}
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
