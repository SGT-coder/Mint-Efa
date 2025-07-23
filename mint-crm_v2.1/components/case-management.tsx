"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, AlertTriangle, CheckCircle, FileText, Send, User } from "lucide-react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast" // Import toast
import { triggerInAppNotification } from "@/actions/notifications" // Import notification trigger

// Define types for your data
interface CaseResponse {
  id: number
  author: string
  message: string
  timestamp: string
  type: string
}

interface Case {
  id: number
  title: string
  description: string
  priority: string
  status: string
  case_number: string
  created_at: string
  assigned_lawyer_name?: string
  contact_name?: string
  responses?: CaseResponse[]
  category?: string
  contact?: { name: string; email: string; company?: string }
  assignee?: { name: string; id: string }
}

export default function CaseManagement() {
  const [selectedCase, setSelectedCase] = useState<any | null>(null)
  const [caseNotes, setCaseNotes] = useState<any[]>([])
  const [caseDetailsLoading, setCaseDetailsLoading] = useState(false)
  const [caseNotesLoading, setCaseNotesLoading] = useState(false)
  const [newCaseOpen, setNewCaseOpen] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "General",
    contactEmail: "",
    assignee: "",
  })
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  // Add search and filter state
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")
  // Add page and totalPages state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  // Add users state
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    async function fetchCases() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/cases/?page=${page}`)
        if (!res.ok) throw new Error("Failed to fetch cases")
        const data = await res.json()
        setCases(data.results)
        setTotalPages(data.total_pages)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [page])

  // Fetch users for assignee list
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/auth/users/")
        if (!res.ok) throw new Error("Failed to fetch users")
        const data = await res.json()
        setUsers(data)
      } catch {}
    }
    fetchUsers()
  }, [])

  // Fetch full case details and notes when a case is selected
  useEffect(() => {
    if (!selectedCase) return
    async function fetchCaseDetailsAndNotes() {
      setCaseDetailsLoading(true)
      setCaseNotesLoading(true)
      try {
        const detailsRes = await fetch(`/api/cases/${selectedCase.id}/`)
        if (detailsRes.ok) {
          const details = await detailsRes.json()
          setSelectedCase((prev: any) => ({ ...prev, ...details }))
        }
        const notesRes = await fetch(`/api/cases/${selectedCase.id}/notes/`)
        if (notesRes.ok) {
          const notes = await notesRes.json()
          setCaseNotes(notes)
        }
      } finally {
        setCaseDetailsLoading(false)
        setCaseNotesLoading(false)
      }
    }
    fetchCaseDetailsAndNotes()
  }, [selectedCase?.id])

  // Create a new case (POST to backend)
  const handleCreateCase = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch("/api/cases/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newCase.title,
          description: newCase.description,
          priority: newCase.priority,
          category: newCase.category,
          contact_email: newCase.contactEmail,
          assignee: newCase.assignee,
        }),
      })
      if (!res.ok) throw new Error("Failed to create case")
      const created: Case = await res.json()
      setCases((prev) => [...prev, created])
      toast({ title: "Case Created", description: `Case \"${created.title}\" has been registered.` })
      setNewCaseOpen(false)
      setNewCase({ title: "", description: "", priority: "Medium", category: "General", contactEmail: "", assignee: "" })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setCreating(false)
    }
  }

  // Add utility to update a case
  const updateCase = async (caseId: string, updates: Partial<Case>) => {
    try {
      const res = await fetch(`/api/cases/${caseId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error("Failed to update case")
      const updated: Case = await res.json()
      setCases((prev) => prev.map((c) => (c.id.toString() === caseId ? updated : c)))
      return updated
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
      throw err
    }
  }

  // Add utility to add a note/response to a case
  const addCaseNote = async (caseId: string, message: string) => {
    try {
      const res = await fetch(`/api/cases/${caseId}/notes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })
      if (!res.ok) throw new Error("Failed to add note")
      const note = await res.json()
      // Optionally, update the selected case's responses in state
      setCases((prev) => prev.map((c) => {
        if (c.id.toString() === caseId) {
          return { ...c, responses: c.responses ? [...c.responses, note] : [note] }
        }
        return c
      }))
      return note
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
      throw err
    }
  }

  // Update handleAssignCase, handleEscalateCase, handleCloseCase, handleAddResponse
  const handleAssignCase = async (caseId: string, userId: string) => {
    try {
      await updateCase(caseId, { assigned_lawyer_name: userId })
      toast({ title: "Case Reassigned", description: `Case ${caseId} has been reassigned.` })
    } catch {}
  }

  const handleEscalateCase = async (caseId: string) => {
    try {
      await updateCase(caseId, { status: "Escalated" })
      toast({ title: "Case Escalated", description: `Case ${caseId} has been escalated.`, variant: "destructive" })
      triggerInAppNotification(`Case ${caseId} has been escalated!`)
    } catch {}
  }

  const handleCloseCase = async (caseId: string) => {
    try {
      await updateCase(caseId, { status: "Closed" })
      toast({ title: "Case Closed", description: `Case ${caseId} has been closed.` })
      triggerInAppNotification(`Case ${caseId} has been closed.`)
    } catch {}
  }

  const handleAddResponse = async (caseId: string) => {
    try {
      await addCaseNote(caseId, responseText)
      setResponseText("")
      toast({ title: "Response Added", description: `Response added to case ${caseId}.` })
      triggerInAppNotification(`New response added to case ${caseId}.`)
    } catch {}
  }

  const getPriorityColor = (priority: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "default"
      case "In Progress":
        return "secondary"
      case "Under Review":
        return "outline"
      case "Escalated":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Case Management</h1>
          <p className="text-muted-foreground">Register, assign, and manage customer support cases</p>
        </div>

        <Dialog open={newCaseOpen} onOpenChange={setNewCaseOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
              <DialogDescription>Register a new customer support case</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Case Title</Label>
                  <Input
                    id="title"
                    value={newCase.title}
                    onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                    placeholder="Brief description of the issue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={newCase.contactEmail}
                    onChange={(e) => setNewCase({ ...newCase, contactEmail: e.target.value })}
                    placeholder="customer@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  placeholder="Detailed description of the issue..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newCase.priority}
                    onValueChange={(value) => setNewCase({ ...newCase, priority: value })}
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
                    value={newCase.category}
                    onValueChange={(value) => setNewCase({ ...newCase, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Configuration">Configuration</SelectItem>
                      <SelectItem value="Access">Access</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignee">Assign To</Label>
                  <Select
                    value={newCase.assignee}
                    onValueChange={(value) => setNewCase({ ...newCase, assignee: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setNewCaseOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCase} disabled={creating}>Create Case</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cases List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Cases</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search cases..."
                      className="pl-10 w-64"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Escalated">Escalated</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div>Loading cases...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : cases.length === 0 ? (
                  <div>No cases found.</div>
                ) : (
                  cases.map((case_: Case) => (
                    <div
                      key={case_.id || case_.case_number}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedCase?.id === case_.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedCase(case_)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{case_.title}</h3>
                            <Badge variant={getPriorityColor(case_.priority)}>{case_.priority}</Badge>
                            <Badge variant={getStatusColor(case_.status)}>{case_.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {case_.case_number || case_.id} {/* fallback for id */} • {case_.contact_name || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">{case_.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Created: {case_.created_at || case_.created}</span>
                            <span>Assigned: {case_.assigned_lawyer_name || "Unassigned"}</span>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAssignCase(case_.id.toString(), "user3")}>
                              <User className="h-4 w-4 mr-2" />
                              Reassign
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEscalateCase(case_.id.toString())}>
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Escalate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCloseCase(case_.id.toString())}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Close Case
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Case Details */}
        <div className="space-y-4">
          {selectedCase ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Case Details
                    <Badge variant={getStatusColor(selectedCase.status)}>{selectedCase.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{selectedCase.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCase.id}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <p className="text-sm">{selectedCase.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Priority</Label>
                      <p>{selectedCase.priority}</p>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <p>{selectedCase.category}</p>
                    </div>
                    <div>
                      <Label>Contact</Label>
                      <p>{selectedCase.contact?.name}</p>
                      <p className="text-muted-foreground">{selectedCase.contact?.email}</p>
                    </div>
                    <div>
                      <Label>Assignee</Label>
                      <p>{selectedCase.assignee?.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Case Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {caseNotesLoading ? (
                      <div>Loading activity...</div>
                    ) : caseDetailsLoading ? (
                      <div>Loading case details...</div>
                    ) : error ? (
                      <div className="text-red-500">{error}</div>
                    ) : caseNotes.length === 0 ? (
                      <div>No activity yet for this case.</div>
                    ) : (
                      caseNotes.map((note) => (
                        <div key={note.id} className="flex space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {note.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium">{note.author}</p>
                              <p className="text-xs text-muted-foreground">{note.timestamp}</p>
                            </div>
                            <p className="text-sm">{note.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <Textarea
                      placeholder="Add a response..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Internal Note
                      </Button>
                      <Button size="sm" onClick={() => handleAddResponse(selectedCase.id.toString())}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Response
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a case to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {/* After the cases list, add pagination controls: */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
