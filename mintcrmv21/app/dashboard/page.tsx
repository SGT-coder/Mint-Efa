"use client"
import {
  Calendar,
  FileText,
  Mail,
  Users,
  User,
  Building2,
  FolderOpen,
  Phone,
  MapPin,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Layout from "@/components/layout" // Import Layout component

// Mock data
const kpiData = {
  activeCases: 24,
  pendingTasks: 18,
  unreadEmails: 7,
  upcomingMeetings: 5,
  totalContacts: 156,
  totalCompanies: 45,
  totalUsers: 12,
  totalDocuments: 89,
}

const recentActivity = [
  {
    id: 1,
    type: "case",
    title: "New case assigned: Network connectivity issue",
    time: "2 minutes ago",
    user: "John Smith",
  },
  {
    id: 2,
    type: "task",
    title: "Task completed: Update customer database",
    time: "15 minutes ago",
    user: "Sarah Johnson",
  },
  { id: 3, type: "email", title: "Email received from ABC Corp", time: "1 hour ago", user: "System" },
  { id: 4, type: "meeting", title: "Meeting scheduled with TechCorp", time: "2 hours ago", user: "Mike Wilson" },
]

const recentCases = [
  {
    id: "CASE-001",
    title: "Server downtime issue",
    status: "In Progress",
    priority: "High",
    assignee: "John Smith",
    created: "2024-01-15",
  },
  {
    id: "CASE-002",
    title: "Email configuration problem",
    status: "Under Review",
    priority: "Medium",
    assignee: "Sarah Johnson",
    created: "2024-01-14",
  },
  {
    id: "CASE-003",
    title: "Database backup failure",
    status: "Resolved",
    priority: "High",
    assignee: "Mike Wilson",
    created: "2024-01-13",
  },
]

const caseSources = [
  { source: "Email", count: 60 },
  { source: "Form Submission", count: 30 },
  { source: "Call Agent", count: 10 },
]

const mintManagementTeam = {
  name: "MInT Management Team",
  email: "management@mintcrm.com",
  phone: "+1 (555) 123-4567",
  address: "123 CRM Lane, Suite 100, Business City, BC 12345",
}

const DashboardContent = () => {
  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.activeCases}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">-3 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.unreadEmails}</div>
            <p className="text-xs text-muted-foreground">+1 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.upcomingMeetings}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        {/* New KPI Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalContacts}</div>
            <p className="text-xs text-muted-foreground">All registered contacts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Organizations in CRM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active system users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">Managed files</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cases">Recent Cases</TabsTrigger>
          <TabsTrigger value="activity">Activity Stream</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Cases */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Cases</CardTitle>
                <CardDescription>Latest customer support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCases.slice(0, 3).map((case_) => (
                    <div key={case_.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{case_.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {case_.id} • {case_.assignee}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge
                          variant={
                            case_.status === "Resolved"
                              ? "default"
                              : case_.status === "In Progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {case_.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{case_.created}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Stream */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "case"
                            ? "bg-blue-500"
                            : activity.type === "task"
                              ? "bg-green-500"
                              : activity.type === "email"
                                ? "bg-yellow-500"
                                : "bg-purple-500"
                        }`}
                      />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time} • {activity.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* MInT Management Team Contact */}
            <Card>
              <CardHeader>
                <CardTitle>MInT Management Team</CardTitle>
                <CardDescription>Contact Information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{mintManagementTeam.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{mintManagementTeam.phone}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <p className="text-sm">{mintManagementTeam.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Cases by Source */}
            <Card>
              <CardHeader>
                <CardTitle>Cases by Source</CardTitle>
                <CardDescription>Breakdown of cases by how they were initiated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {caseSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{source.source}</p>
                    </div>
                    <Badge variant="secondary">{source.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cases">
          <Card>
            <CardHeader>
              <CardTitle>All Cases</CardTitle>
              <CardDescription>Manage customer support cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCases.map((case_) => (
                  <div
                    key={case_.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{case_.title}</h3>
                        <Badge variant={case_.priority === "High" ? "destructive" : "secondary"}>
                          {case_.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {case_.id} • Assigned to {case_.assignee}
                      </p>
                      <p className="text-xs text-muted-foreground">Created: {case_.created}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge
                        variant={
                          case_.status === "Resolved"
                            ? "default"
                            : case_.status === "In Progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {case_.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Stream</CardTitle>
              <CardDescription>Real-time system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                    <div
                      className={`w-3 h-3 rounded-full mt-2 ${
                        activity.type === "case"
                          ? "bg-blue-500"
                          : activity.type === "task"
                            ? "bg-green-500"
                            : activity.type === "email"
                              ? "bg-yellow-500"
                              : "bg-purple-500"
                      }`}
                    />
                    <div className="flex-1 space-y-2">
                      <p className="font-medium">{activity.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{activity.time}</span>
                        <span>•</span>
                        <span>{activity.user}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default function DashboardPage() {
  return (
    <Layout>
      <DashboardContent />
    </Layout>
  )
}
