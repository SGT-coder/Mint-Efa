"use client"

import React, { useState, useEffect } from "react"
import { Search, Plus, MoreHorizontal, Calendar, User, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch cases from backend with filters
  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.append("search", searchTerm)
        if (statusFilter !== "all") params.append("status", statusFilter)
        if (priorityFilter !== "all") params.append("priority", priorityFilter)
        const res = await fetch(`/api/cases/?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch cases")
        const data = await res.json()
        setCases(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [searchTerm, statusFilter, priorityFilter])

  // Dropdown action handlers
  const handleEditCase = async (id: string) => {
    // Example: open edit modal or navigate to edit page
    // (No-op, as per instruction not to add UI)
  }
  const handleAssignToTeam = async (id: string) => {
    // Example: assign to team (PATCH request)
    await fetch(`/api/cases/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Assigned" }),
    })
    // Refetch cases
    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (statusFilter !== "all") params.append("status", statusFilter)
    if (priorityFilter !== "all") params.append("priority", priorityFilter)
    const res = await fetch(`/api/cases/?${params.toString()}`)
    if (res.ok) setCases(await res.json())
  }
  const handleCloseCase = async (id: string) => {
    // Example: close case (PATCH request)
    await fetch(`/api/cases/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Resolved" }),
    })
    // Refetch cases
    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (statusFilter !== "all") params.append("status", statusFilter)
    if (priorityFilter !== "all") params.append("priority", priorityFilter)
    const res = await fetch(`/api/cases/?${params.toString()}`)
    if (res.ok) setCases(await res.json())
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "default"
      case "In Progress":
        return "secondary"
      case "Under Review":
        return "outline"
      case "Assigned":
        return "outline"
      default:
        return "outline"
    }
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cases</h1>
          <p className="text-muted-foreground">Manage customer support requests and issues</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <div className="space-y-4">
        {loading && <p>Loading cases...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {cases.map((case_) => (
          <Card key={case_.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{case_.title}</h3>
                        <Badge variant={getPriorityColor(case_.priority)}>{case_.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{case_.id}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCase(case_.id)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCase(case_.id)}>Edit Case</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAssignToTeam(case_.id)}>Assign to Team</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCloseCase(case_.id)}>Close Case</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-sm text-gray-600">{case_.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{case_.contact.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>{case_.contact.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Created {case_.created}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
                  <Badge variant={getStatusColor(case_.status)} className="w-fit">
                    {case_.status}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{case_.assignee.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{case_.assignee.name}</p>
                      <p className="text-muted-foreground">Assignee</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cases.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No cases found matching your criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
