"use client"

import { useState } from "react"
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
  id: string
  name: string
  trigger: string
  condition: string
  action: string
  actionDetail: string
}

export default function WorkflowManager() {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([
    {
      id: "wf-1",
      name: "Notify on High Priority Case",
      trigger: "Case Status Change",
      condition: "Status is 'High Priority'",
      action: "In-App Notification",
      actionDetail: "New high priority case created: {{case.title}}",
    },
    {
      id: "wf-2",
      name: "Email Assignee on Task Completion",
      trigger: "Task Status Change",
      condition: "Status is 'Completed'",
      action: "Email Notification",
      actionDetail: "Task '{{task.title}}' completed by {{task.assignee}}.",
    },
  ])
  const [newWorkflowOpen, setNewWorkflowOpen] = useState(false)
  const [currentWorkflow, setCurrentWorkflow] = useState<Omit<WorkflowRule, "id">>({
    name: "",
    trigger: "",
    condition: "",
    action: "",
    actionDetail: "",
  })

  const handleAddWorkflow = () => {
    if (!currentWorkflow.name || !currentWorkflow.trigger || !currentWorkflow.action) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for the workflow.",
        variant: "destructive",
      })
      return
    }
    setWorkflows([...workflows, { ...currentWorkflow, id: `wf-${Date.now()}` }])
    setNewWorkflowOpen(false)
    setCurrentWorkflow({ name: "", trigger: "", condition: "", action: "", actionDetail: "" })
    toast({
      title: "Workflow Added",
      description: `Workflow "${currentWorkflow.name}" has been created.`,
    })
  }

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((wf) => wf.id !== id))
    toast({
      title: "Workflow Deleted",
      description: "The workflow has been successfully removed.",
    })
  }

  // This function would be called by other components (e.g., CaseManagement, TaskManagement)
  const triggerInAppNotification = (message: string) => {
    toast({
      title: "New Notification",
      description: message,
      duration: 5000,
    })
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
                    value={currentWorkflow.trigger}
                    onValueChange={(value) => setCurrentWorkflow({ ...currentWorkflow, trigger: value })}
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
                    value={currentWorkflow.condition}
                    onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, condition: e.target.value })}
                    placeholder="e.g., Status is 'High Priority'"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Select
                  value={currentWorkflow.action}
                  onValueChange={(value) => setCurrentWorkflow({ ...currentWorkflow, action: value })}
                >
                  <SelectTrigger id="action">
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In-App Notification">In-App Notification</SelectItem>
                    <SelectItem value="Email Notification">Email Notification</SelectItem>
                    <SelectItem value="SMS Notification">SMS Notification</SelectItem>
                    <SelectItem value="Call Notification">Call Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="action-detail">Action Detail (e.g., message, email subject)</Label>
                <Textarea
                  id="action-detail"
                  value={currentWorkflow.actionDetail}
                  onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, actionDetail: e.target.value })}
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
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{workflow.name}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteWorkflow(workflow.id)}>
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>Trigger: {workflow.trigger}</span>
              </div>
              {workflow.condition && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Condition: {workflow.condition}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {workflow.action === "In-App Notification" && <Bell className="h-4 w-4" />}
                {workflow.action === "Email Notification" && <Mail className="h-4 w-4" />}
                {workflow.action === "SMS Notification" && <MessageSquare className="h-4 w-4" />}
                {workflow.action === "Call Notification" && <Phone className="h-4 w-4" />}
                <span>Action: {workflow.action}</span>
              </div>
              <p className="text-sm text-gray-700 mt-2">{workflow.actionDetail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
