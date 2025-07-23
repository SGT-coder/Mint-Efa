"use client"

import { useState, useEffect } from "react"
import { Plus, Trash, Bell, Mail, MessageSquare, Phone, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast" // Assuming use-toast is available

interface WorkflowRule {
  id: number | string
  name: string
  description: string
  trigger_event: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export default function WorkflowManager() {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([])
  const [newWorkflowOpen, setNewWorkflowOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentWorkflow, setCurrentWorkflow] = useState({
    name: "",
    trigger_event: "",
    description: "",
    is_active: true,
  })
  const [editWorkflowOpen, setEditWorkflowOpen] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowRule | null>(null)

  // Add state for steps management
  const [stepsDialogOpen, setStepsDialogOpen] = useState(false)
  const [stepsWorkflowId, setStepsWorkflowId] = useState<number | string | null>(null)
  const [steps, setSteps] = useState<any[]>([])
  const [stepsLoading, setStepsLoading] = useState(false)
  const [stepsError, setStepsError] = useState<string | null>(null)
  const [editingStep, setEditingStep] = useState<any | null>(null)
  const [stepForm, setStepForm] = useState({ name: "", step_type: "create_task", order: 1, parameters: {}, is_active: true })

  // Add state for executions viewing
  const [executionsDialogOpen, setExecutionsDialogOpen] = useState(false)
  const [executionsWorkflowId, setExecutionsWorkflowId] = useState<number | string | null>(null)
  const [executions, setExecutions] = useState<any[]>([])
  const [executionsLoading, setExecutionsLoading] = useState(false)
  const [executionsError, setExecutionsError] = useState<string | null>(null)

  // Fetch workflows from backend
  useEffect(() => {
    async function fetchWorkflows() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/workflows/")
        if (!res.ok) throw new Error("Failed to fetch workflows")
        const data = await res.json()
        setWorkflows(data)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchWorkflows()
  }, [])

  // Create workflow
  const handleAddWorkflow = async () => {
    if (!currentWorkflow.name || !currentWorkflow.trigger_event) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for the workflow.",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/workflows/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentWorkflow),
      })
      if (!res.ok) throw new Error("Failed to create workflow")
      const created: WorkflowRule = await res.json()
      setWorkflows((prev) => [...prev, created])
      setNewWorkflowOpen(false)
      setCurrentWorkflow({ name: "", trigger_event: "", description: "", is_active: true })
      toast({
        title: "Workflow Added",
        description: `Workflow "${created.name}" has been created.`,
      })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Delete workflow
  const handleDeleteWorkflow = async (id: number | string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/workflows/${id}/`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete workflow")
      setWorkflows((prev) => prev.filter((wf) => wf.id !== id))
      toast({
        title: "Workflow Deleted",
        description: "The workflow has been successfully removed.",
      })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Edit workflow
  const handleEditWorkflow = (workflow: WorkflowRule) => {
    setEditingWorkflow(workflow)
    setEditWorkflowOpen(true)
  }

  const handleUpdateWorkflow = async () => {
    if (!editingWorkflow) return
    setLoading(true)
    try {
      const res = await fetch(`/api/workflows/${editingWorkflow.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingWorkflow),
      })
      if (!res.ok) throw new Error("Failed to update workflow")
      const updated: WorkflowRule = await res.json()
      setWorkflows((prev) => prev.map((wf) => wf.id === updated.id ? updated : wf))
      setEditWorkflowOpen(false)
      setEditingWorkflow(null)
      toast({ title: "Workflow Updated", description: `Workflow "${updated.name}" has been updated.` })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // This function would be called by other components (e.g., CaseManagement, TaskManagement)
  const triggerInAppNotification = (message: string) => {
    toast({
      title: "New Notification",
      description: message,
      duration: 5000,
    })
  }

  // Fetch steps for a workflow
  const openStepsDialog = async (workflowId: number | string) => {
    setStepsDialogOpen(true)
    setStepsWorkflowId(workflowId)
    setStepsLoading(true)
    setStepsError(null)
    try {
      const res = await fetch(`/api/workflows/${workflowId}/steps/`)
      if (!res.ok) throw new Error("Failed to fetch steps")
      const data = await res.json()
      setSteps(data)
    } catch (err: any) {
      setStepsError(err.message || "Unknown error")
    } finally {
      setStepsLoading(false)
    }
  }

  // Add step
  const handleAddStep = async () => {
    if (!stepsWorkflowId) return
    setStepsLoading(true)
    try {
      const res = await fetch(`/api/workflows/${stepsWorkflowId}/steps/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stepForm),
      })
      if (!res.ok) throw new Error("Failed to add step")
      const created = await res.json()
      setSteps((prev) => [...prev, created])
      setStepForm({ name: "", step_type: "create_task", order: 1, parameters: {}, is_active: true })
      toast({ title: "Step Added", description: `Step "${created.name}" has been added.` })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setStepsLoading(false)
    }
  }

  // Edit step
  const handleEditStep = (step: any) => {
    setEditingStep(step)
  }
  const handleUpdateStep = async () => {
    if (!stepsWorkflowId || !editingStep) return
    setStepsLoading(true)
    try {
      const res = await fetch(`/api/workflows/${stepsWorkflowId}/steps/${editingStep.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingStep),
      })
      if (!res.ok) throw new Error("Failed to update step")
      const updated = await res.json()
      setSteps((prev) => prev.map((s) => s.id === updated.id ? updated : s))
      setEditingStep(null)
      toast({ title: "Step Updated", description: `Step "${updated.name}" has been updated.` })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setStepsLoading(false)
    }
  }
  // Delete step
  const handleDeleteStep = async (stepId: number | string) => {
    if (!stepsWorkflowId) return
    setStepsLoading(true)
    try {
      const res = await fetch(`/api/workflows/${stepsWorkflowId}/steps/${stepId}/`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete step")
      setSteps((prev) => prev.filter((s) => s.id !== stepId))
      toast({ title: "Step Deleted", description: "The step has been deleted." })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setStepsLoading(false)
    }
  }

  // Fetch executions for a workflow
  const openExecutionsDialog = async (workflowId: number | string) => {
    setExecutionsDialogOpen(true)
    setExecutionsWorkflowId(workflowId)
    setExecutionsLoading(true)
    setExecutionsError(null)
    try {
      const res = await fetch(`/api/workflows/${workflowId}/executions/`)
      if (!res.ok) throw new Error("Failed to fetch executions")
      const data = await res.json()
      setExecutions(data)
    } catch (err: any) {
      setExecutionsError(err.message || "Unknown error")
    } finally {
      setExecutionsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Workflow Manager</h1>
          <p className="text-muted-foreground">Automate actions for cases and tasks</p>
        </div>
        <Dialog open={newWorkflowOpen} onOpenChange={setNewWorkflowOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>Define automated actions based on triggers and conditions.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  id="workflow-name"
                  value={currentWorkflow.name}
                  onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, name: e.target.value })}
                  placeholder="e.g., Notify on High Priority Case"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trigger">Trigger Event</Label>
                  <Select
                    value={currentWorkflow.trigger_event}
                    onValueChange={(value) => setCurrentWorkflow({ ...currentWorkflow, trigger_event: value })}
                  >
                    <SelectTrigger id="trigger">
                      <SelectValue placeholder="Select a trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Case Status Change">Case Status Change</SelectItem>
                      <SelectItem value="Task Status Change">Task Status Change</SelectItem>
                      <SelectItem value="New Case Created">New Case Created</SelectItem>
                      <SelectItem value="Task Due Date Approaching">Task Due Date Approaching</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition (Optional)</Label>
                  <Input
                    id="condition"
                    value={currentWorkflow.description}
                    onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, description: e.target.value })}
                    placeholder="e.g., Status is 'High Priority'"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Select
                  value={currentWorkflow.is_active ? "Active" : "Inactive"}
                  onValueChange={(value) => setCurrentWorkflow({ ...currentWorkflow, is_active: value === "Active" })}
                >
                  <SelectTrigger id="action">
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="action-detail">Action Detail (e.g., message, email subject)</Label>
                <Textarea
                  id="action-detail"
                  value={currentWorkflow.description}
                  onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, description: e.target.value })}
                  placeholder="Enter notification message or email content. Use {{variable}} for dynamic data."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewWorkflowOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWorkflow}>Create Workflow</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <p>Loading workflows...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && workflows.length === 0 && (
          <p>No workflows defined yet. Create a new one!</p>
        )}
        {!loading && !error && workflows.length > 0 && (
          workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{workflow.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditWorkflow(workflow)}>
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteWorkflow(workflow.id)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openStepsDialog(workflow.id)}>
                    <Zap className="h-4 w-4 text-purple-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openExecutionsDialog(workflow.id)}>
                    <Bell className="h-4 w-4 text-yellow-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4" />
                  <span>Trigger: {workflow.trigger_event}</span>
                </div>
                {workflow.description && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>Condition: {workflow.description}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Status: {workflow.is_active ? "Active" : "Inactive"}</span>
                </div>
                <p className="text-sm text-gray-700 mt-2">{workflow.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={editWorkflowOpen} onOpenChange={setEditWorkflowOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Workflow</DialogTitle>
            <DialogDescription>Update the details of the workflow.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-workflow-name">Workflow Name</Label>
              <Input
                id="edit-workflow-name"
                value={editingWorkflow?.name}
                onChange={(e) => setEditingWorkflow({ ...editingWorkflow!, name: e.target.value })}
                placeholder="e.g., Notify on High Priority Case"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-trigger">Trigger Event</Label>
                <Select
                  value={editingWorkflow?.trigger_event}
                  onValueChange={(value) => setEditingWorkflow({ ...editingWorkflow!, trigger_event: value })}
                >
                  <SelectTrigger id="edit-trigger">
                    <SelectValue placeholder="Select a trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Case Status Change">Case Status Change</SelectItem>
                    <SelectItem value="Task Status Change">Task Status Change</SelectItem>
                    <SelectItem value="New Case Created">New Case Created</SelectItem>
                    <SelectItem value="Task Due Date Approaching">Task Due Date Approaching</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-condition">Condition (Optional)</Label>
                <Input
                  id="edit-condition"
                  value={editingWorkflow?.description}
                  onChange={(e) => setEditingWorkflow({ ...editingWorkflow!, description: e.target.value })}
                  placeholder="e.g., Status is 'High Priority'"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-action">Action</Label>
              <Select
                value={editingWorkflow?.is_active ? "Active" : "Inactive"}
                onValueChange={(value) => setEditingWorkflow({ ...editingWorkflow!, is_active: value === "Active" })}
              >
                <SelectTrigger id="edit-action">
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-action-detail">Action Detail (e.g., message, email subject)</Label>
              <Textarea
                id="edit-action-detail"
                value={editingWorkflow?.description}
                onChange={(e) => setEditingWorkflow({ ...editingWorkflow!, description: e.target.value })}
                placeholder="Enter notification message or email content. Use {{variable}} for dynamic data."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditWorkflowOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateWorkflow}>Update Workflow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={stepsDialogOpen} onOpenChange={setStepsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage Steps for Workflow {stepsWorkflowId}</DialogTitle>
            <DialogDescription>Add, edit, or delete steps for this workflow.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-end">
              <DialogTrigger asChild>
                <Button onClick={() => setStepForm({ ...stepForm, order: steps.length + 1 })}>
                  <Plus className="h-4 w-4 mr-2" /> Add New Step
                </Button>
              </DialogTrigger>
            </div>
            {stepsLoading && <p>Loading steps...</p>}
            {stepsError && <p className="text-red-500">{stepsError}</p>}
            {!stepsLoading && !stepsError && steps.length === 0 && (
              <p>No steps defined for this workflow. Add one to get started!</p>
            )}
            {!stepsLoading && !stepsError && steps.length > 0 && (
              <div className="space-y-4">
                {steps.map((step) => (
                  <Card key={step.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-semibold">{step.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditStep(step)}>
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteStep(step.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Type: {step.step_type}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Order: {step.order}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Status: {step.is_active ? "Active" : "Inactive"}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">Parameters: {JSON.stringify(step.parameters)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStepsDialogOpen(false)}>
              Cancel
            </Button>
            {editingStep && (
              <Button onClick={handleUpdateStep}>Update Step</Button>
            )}
            {!editingStep && (
              <Button onClick={handleAddStep}>Add Step</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={executionsDialogOpen} onOpenChange={setExecutionsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Workflow Executions for {executionsWorkflowId}</DialogTitle>
            <DialogDescription>List of executions for this workflow.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {executionsLoading && <p>Loading executions...</p>}
            {executionsError && <p className="text-red-500">{executionsError}</p>}
            {!executionsLoading && !executionsError && executions.length === 0 && (
              <p>No executions found for this workflow.</p>
            )}
            {!executionsLoading && !executionsError && executions.length > 0 && (
              <div className="space-y-4">
                {executions.map((execution) => (
                  <Card key={execution.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-semibold">Execution {execution.id}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Status: {execution.status}</span>
                        <span>Started: {new Date(execution.started_at).toLocaleString()}</span>
                        <span>Completed: {execution.completed_at ? new Date(execution.completed_at).toLocaleString() : 'N/A'}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Trigger Data: {JSON.stringify(execution.trigger_data)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Result Data: {JSON.stringify(execution.result_data)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExecutionsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
