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
import { useEffect, useState } from "react"

interface DashboardStats {
  total_cases: number
  open_cases: number
  pending_tasks: number
  total_contacts: number
  total_companies?: number
  total_users?: number
  total_documents?: number
  cases_by_status: Array<{ status: string; count: number }>
  tasks_by_priority: Array<{ priority: string; count: number }>
  recent_cases: Array<any>
}

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
            <div className="text-2xl font-bold">{dashboardStats?.open_cases}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.pending_tasks}</div>
            <p className="text-xs text-muted-foreground">-3 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadEmails}</div>
            <p className="text-xs text-muted-foreground">+1 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMeetings}</div>
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
            <div className="text-2xl font-bold">{dashboardStats?.total_contacts}</div>
            <p className="text-xs text-muted-foreground">All registered contacts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.total_companies}</div>
            <p className="text-xs text-muted-foreground">Organizations in CRM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.total_users}</div>
            <p className="text-xs text-muted-foreground">Active system users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.total_documents}</div>
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
                {casesBySource.map((source, index) => (
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
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [recentCases, setRecentCases] = useState<any[]>([])
  const [unreadEmails, setUnreadEmails] = useState<number>(0)
  const [upcomingMeetings, setUpcomingMeetings] = useState<number>(0)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [casesBySource, setCasesBySource] = useState<{ source: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true)
      setError(null)
      try {
        // Dashboard stats
        const statsRes = await fetch("/api/reports/dashboard-stats/")
        if (!statsRes.ok) throw new Error("Failed to fetch dashboard stats")
        const stats = await statsRes.json()
        setDashboardStats(stats)

        // Recent cases
        const casesRes = await fetch("/api/cases/?ordering=-created_at&limit=10")
        if (!casesRes.ok) throw new Error("Failed to fetch recent cases")
        const cases = await casesRes.json()
        setRecentCases(cases)

        // Emails
        const emailsRes = await fetch("/api/emails/")
        if (!emailsRes.ok) throw new Error("Failed to fetch emails")
        const emails = await emailsRes.json()
        setUnreadEmails(Array.isArray(emails) ? emails.filter((e) => !e.read).length : 0)

        // Meetings
        const meetingsRes = await fetch("/api/meetings/")
        if (!meetingsRes.ok) throw new Error("Failed to fetch meetings")
        const meetings = await meetingsRes.json()
        const now = new Date()
        setUpcomingMeetings(Array.isArray(meetings) ? meetings.filter((m) => {
          if (!m.date || !m.time) return false
          const meetingDate = new Date(`${m.date}T${m.time}`)
          return meetingDate > now
        }).length : 0)

        // Tasks
        const tasksRes = await fetch("/api/tasks/?ordering=-created_at&limit=10")
        if (!tasksRes.ok) throw new Error("Failed to fetch tasks")
        const tasks = await tasksRes.json()

        // Synthesize recent activity
        const activity: any[] = []
        cases.slice(0, 5).forEach((c: any) => activity.push({
          id: `case-${c.id}`,
          type: "case",
          title: `Case: ${c.title}`,
          time: c.created_at || c.created,
          user: c.assigned_lawyer_name || c.assignee || "-"
        }))
        tasks.slice(0, 5).forEach((t: any) => activity.push({
          id: `task-${t.id}`,
          type: "task",
          title: `Task: ${t.title}`,
          time: t.created_at || t.created,
          user: t.assignee_name || t.assignee || "-"
        }))
        emails.slice(0, 5).forEach((e: any) => activity.push({
          id: `email-${e.id}`,
          type: "email",
          title: `Email: ${e.subject}`,
          time: e.timestamp || e.created_at,
          user: e.from?.name || e.from_email || "-"
        }))
        meetings.slice(0, 5).forEach((m: any) => activity.push({
          id: `meeting-${m.id}`,
          type: "meeting",
          title: `Meeting: ${m.title}`,
          time: m.date ? `${m.date} ${m.time}` : m.created_at,
          user: m.organizer?.name || m.organizer || "-"
        }))
        // Sort by time descending (if possible)
        activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        setRecentActivity(activity.slice(0, 10))

        // Cases by Source (aggregate from cases if source field exists)
        const sourceMap: Record<string, number> = {}
        cases.forEach((c: any) => {
          const source = c.source || "Unknown"
          sourceMap[source] = (sourceMap[source] || 0) + 1
        })
        setCasesBySource(Object.entries(sourceMap).map(([source, count]) => ({ source, count })))
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }
  if (!dashboardStats) {
    return <div className="text-center py-8">No dashboard data available.</div>
  }

  return (
    <Layout>
      <DashboardContent />
    </Layout>
  )
}
