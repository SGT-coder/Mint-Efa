"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Calendar, CheckSquare, Clock, AlertCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast" // Import toast
import { triggerInAppNotification } from "@/actions/notifications" // Import notification trigger

// Define Task type
interface Task {
  id: number | string
  title: string
  description: string
  status: string
  priority: string
  assignee: { name: string; id: string }
  dueDate: string
  caseId?: string
  completed: boolean
  category: string
  estimatedHours: number | string
  actualHours: number | string
}

const [users, setUsers] = useState<{ id: string; name: string; role?: string }[]>([])
const [usersLoading, setUsersLoading] = useState(false)
const [usersError, setUsersError] = useState<string | null>(null)

// Fetch users for assignee dropdown
useEffect(() => {
  async function fetchUsers() {
    setUsersLoading(true)
    setUsersError(null)
    try {
      const res = await fetch("/api/auth/users/")
      if (!res.ok) throw new Error("Failed to fetch users")
      const data = await res.json()
      setUsers(data)
    } catch (err: any) {
      setUsersError(err.message || "Unknown error")
    } finally {
      setUsersLoading(false)
    }
  }
  fetchUsers()
}, [])

export default function TaskManagement() {
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignee: "",
    dueDate: "",
    category: "General",
    estimatedHours: "",
    caseId: "",
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [editTaskOpen, setEditTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTaskLoading, setEditTaskLoading] = useState(false)
  const [editTaskError, setEditTaskError] = useState<string | null>(null)
  const [deleteTaskId, setDeleteTaskId] = useState<string | number | null>(null)
  const [deleteTaskLoading, setDeleteTaskLoading] = useState(false)
  const [deleteTaskError, setDeleteTaskError] = useState<string | null>(null)

  // Fetch tasks from backend
  useEffect(() => {
    async function fetchTasks() {
      setLoading(true)
      setError(null)
      try {
        let url = `/api/tasks/?page=${page}`
        if (search) url += `&search=${encodeURIComponent(search)}`
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch tasks")
        const data = await res.json()
        setTasks(data.results || data)
        setTotalPages(data.total_pages || 1)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [search, page])

  // Create task
  const handleCreateTask = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      })
      if (!res.ok) throw new Error("Failed to create task")
      const created: Task = await res.json()
      setTasks((prev) => [...prev, created])
      setNewTaskOpen(false)
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        assignee: "",
        dueDate: "",
        category: "General",
        estimatedHours: "",
        caseId: "",
      })
      toast({
        title: "Task Created",
        description: `Task \"${created.title}\" has been created.`,
      })
      // Optionally trigger notification
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Toggle task completion
  const handleToggleTask = async (taskId: number | string) => {
    setLoading(true)
    try {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return
      const updatedStatus = task.completed ? "Pending" : "Completed"
      const res = await fetch(`/api/tasks/${taskId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed, status: updatedStatus }),
      })
      if (!res.ok) throw new Error("Failed to update task")
      const updated: Task = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)))
      toast({
        title: "Task Status Updated",
        description: `Task \"${task.title}\" marked as ${updatedStatus}.`,
      })
      // Optionally trigger notification
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Edit task handlers
  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setEditTaskOpen(true)
  }
  const handleUpdateTask = async () => {
    if (!editingTask) return
    setEditTaskLoading(true)
    setEditTaskError(null)
    try {
      const res = await fetch(`/api/tasks/${editingTask.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTask),
      })
      if (!res.ok) throw new Error("Failed to update task")
      const updated: Task = await res.json()
      setTasks((prev) => prev.map((t) => t.id === updated.id ? updated : t))
      setEditTaskOpen(false)
      setEditingTask(null)
      toast({ title: "Task Updated", description: `Task \"${updated.title}\" updated.` })
    } catch (err: any) {
      setEditTaskError(err.message || "Unknown error")
    } finally {
      setEditTaskLoading(false)
    }
  }
  // Delete task handlers
  const handleDeleteTask = (taskId: string | number) => {
    setDeleteTaskId(taskId)
  }
  const confirmDeleteTask = async () => {
    if (!deleteTaskId) return
    setDeleteTaskLoading(true)
    setDeleteTaskError(null)
    try {
      const res = await fetch(`/api/tasks/${deleteTaskId}/`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete task")
      setTasks((prev) => prev.filter((t) => t.id !== deleteTaskId))
      setDeleteTaskId(null)
      toast({ title: "Task Deleted", description: "Task has been deleted." })
    } catch (err: any) {
      setDeleteTaskError(err.message || "Unknown error")
    } finally {
      setDeleteTaskLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckSquare className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-muted-foreground">Create, assign, and track task progress</p>
        </div>

        <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Create and assign a new task</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Brief description of the task"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Detailed task description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assign To</Label>
                  <Select
                    value={newTask.assignee}
                    onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                    disabled={usersLoading || !!usersError}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={usersLoading ? "Loading..." : usersError ? "Error" : "Select user"} />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {usersError && <p className="text-red-500 text-xs mt-1">{usersError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTask.category}
                    onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Documentation">Documentation</SelectItem>
                      <SelectItem value="Testing">Testing</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedHours">Est. Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
                    placeholder="4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caseId">Related Case (Optional)</Label>
                <Input
                  id="caseId"
                  value={newTask.caseId}
                  onChange={(e) => setNewTask({ ...newTask, caseId: e.target.value })}
                  placeholder="CASE-001"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setNewTaskOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{tasks.filter((t) => t.status === "In Progress").length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{tasks.filter((t) => t.status === "Pending").length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{tasks.filter((t) => t.completed).length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">
                  {tasks.filter((t) => new Date(t.dueDate) < new Date() && !t.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Tasks</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-muted-foreground text-center py-4">Loading tasks...</p>}
          {error && <p className="text-red-500 text-center py-4">{error}</p>}
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <Checkbox checked={task.completed} onCheckedChange={() => handleToggleTask(task.id)} className="mt-1" />

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h3>
                        <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <Badge variant="outline">{task.status}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{task.assignee.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {task.dueDate}</span>
                      </div>
                      {task.caseId && (
                        <div className="flex items-center space-x-1">
                          <span>Case: {task.caseId}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-muted-foreground">
                        {task.actualHours}h / {task.estimatedHours}h
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {task.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add pagination controls below the task list */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}

      {/* Edit Task Dialog */}
      <Dialog open={editTaskOpen} onOpenChange={setEditTaskOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Edit the details of the task.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Task Title</Label>
              <Input
                id="edit-title"
                value={editingTask?.title || ""}
                onChange={e => setEditingTask(editingTask ? { ...editingTask, title: e.target.value } : null)}
                placeholder="Task Title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingTask?.description || ""}
                onChange={e => setEditingTask(editingTask ? { ...editingTask, description: e.target.value } : null)}
                placeholder="Description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-assignee">Assign To</Label>
                <Select
                  value={editingTask?.assignee?.id || ""}
                  onValueChange={value => setEditingTask(editingTask ? { ...editingTask, assignee: value } : null)}
                  disabled={usersLoading || !!usersError}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={usersLoading ? "Loading..." : usersError ? "Error" : "Select user"} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {usersError && <p className="text-red-500 text-xs mt-1">{usersError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dueDate">Due Date</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={editingTask?.dueDate || ""}
                  onChange={e => setEditingTask(editingTask ? { ...editingTask, dueDate: e.target.value } : null)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={editingTask?.priority || ""}
                  onValueChange={value => setEditingTask(editingTask ? { ...editingTask, priority: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingTask?.category || ""}
                  onValueChange={value => setEditingTask(editingTask ? { ...editingTask, category: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Documentation">Documentation</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-estimatedHours">Est. Hours</Label>
                <Input
                  id="edit-estimatedHours"
                  type="number"
                  value={editingTask?.estimatedHours || ""}
                  onChange={e => setEditingTask(editingTask ? { ...editingTask, estimatedHours: e.target.value } : null)}
                  placeholder="4"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-caseId">Related Case (Optional)</Label>
              <Input
                id="edit-caseId"
                value={editingTask?.caseId || ""}
                onChange={e => setEditingTask(editingTask ? { ...editingTask, caseId: e.target.value } : null)}
                placeholder="CASE-001"
              />
            </div>
            {editTaskError && <p className="text-red-500 text-sm">{editTaskError}</p>}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditTaskOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTask} disabled={editTaskLoading}>
                {editTaskLoading ? "Updating..." : "Update Task"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Task Confirm Dialog */}
      <Dialog open={!!deleteTaskId} onOpenChange={open => { if (!open) setDeleteTaskId(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>Are you sure you want to delete this task?</DialogDescription>
          </DialogHeader>
          {deleteTaskError && <p className="text-red-500 text-sm">{deleteTaskError}</p>}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteTaskId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTask} disabled={deleteTaskLoading}>
              {deleteTaskLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
