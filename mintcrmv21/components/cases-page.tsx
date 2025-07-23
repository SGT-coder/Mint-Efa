"use client"

import { useState } from "react"
import { Search, Plus, MoreHorizontal, Calendar, User, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const cases = [
  {
    id: "CASE-001",
    title: "Server downtime issue",
    description: "Customer reporting intermittent server connectivity issues affecting their operations.",
    status: "In Progress",
    priority: "High",
    assignee: { name: "John Smith", avatar: "JS" },
    contact: { name: "Alice Johnson", company: "TechCorp Inc." },
    created: "2024-01-15",
    updated: "2024-01-16",
    category: "Technical",
  },
  {
    id: "CASE-002",
    title: "Email configuration problem",
    description: "Unable to configure email settings for new domain setup.",
    status: "Under Review",
    priority: "Medium",
    assignee: { name: "Sarah Johnson", avatar: "SJ" },
    contact: { name: "Bob Wilson", company: "ABC Corp" },
    created: "2024-01-14",
    updated: "2024-01-15",
    category: "Configuration",
  },
  {
    id: "CASE-003",
    title: "Database backup failure",
    description: "Automated database backup process failing for the past 3 days.",
    status: "Resolved",
    priority: "High",
    assignee: { name: "Mike Wilson", avatar: "MW" },
    contact: { name: "Carol Davis", company: "DataFlow Ltd" },
    created: "2024-01-13",
    updated: "2024-01-14",
    category: "Database",
  },
  {
    id: "CASE-004",
    title: "User access permissions",
    description: "New employee needs access to customer portal and reporting tools.",
    status: "Assigned",
    priority: "Low",
    assignee: { name: "Lisa Chen", avatar: "LC" },
    contact: { name: "David Brown", company: "SecureNet" },
    created: "2024-01-12",
    updated: "2024-01-13",
    category: "Access",
  },
]

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredCases = cases.filter((case_) => {
    const matchesSearch =
      case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || case_.status.toLowerCase().replace(" ", "-") === statusFilter
    const matchesPriority = priorityFilter === "all" || case_.priority.toLowerCase() === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

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
                onChange={(e) => setSearchTerm(e.target.value)}
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
        {filteredCases.map((case_) => (
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Case</DropdownMenuItem>
                        <DropdownMenuItem>Assign to Team</DropdownMenuItem>
                        <DropdownMenuItem>Close Case</DropdownMenuItem>
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

      {filteredCases.length === 0 && (
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
