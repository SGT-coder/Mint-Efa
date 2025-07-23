"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Calendar, ChevronDown, FileText, Mail, Menu, Settings, Users, X, BarChart3, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, CheckSquare, Building2, FolderOpen } from "lucide-react"

// Mock data
const kpiData = {
  activeCases: 24,
  pendingTasks: 18,
  unreadEmails: 7,
  upcomingMeetings: 5,
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

const Navigation = ({ isMobile = false, onClose = () => {}, isCollapsed = false, onToggle = () => {} }) => {
  const [activeComponent, setActiveComponent] = useState("dashboard")

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, active: true, component: "dashboard" },
    { name: "Cases", icon: FileText, count: 24, component: "cases" },
    { name: "Tasks", icon: CheckSquare, count: 18, component: "tasks" },
    { name: "Contacts", icon: Users, count: 156, component: "contacts" },
    { name: "Accounts", icon: Building2, count: 45, component: "accounts" },
    { name: "Meetings", icon: Calendar, count: 5, component: "meetings" },
    { name: "Documents", icon: FolderOpen, count: 89, component: "documents" },
    { name: "Emails", icon: Mail, count: 7, component: "emails" },
    { name: "Reports", icon: BarChart3, component: "reports" },
    { name: "Users", icon: User, component: "users" },
  ]

  return (
    <nav
      className={`${
        isMobile ? "w-full" : isCollapsed ? "w-20" : "w-72"
      } bg-gradient-to-b from-green-800 via-green-700 to-yellow-600 text-white transition-all duration-300 ease-in-out shadow-xl border-r border-green-600`}
    >
      <div className="p-4 space-y-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-green-600/50">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-green-800 font-bold text-sm">M</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">MInT CRM</h1>
                <p className="text-xs text-green-200">Customer Relations</p>
              </div>
            </div>
          )}
          {isMobile ? (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-green-600/50 ml-auto">
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-green-600/50 p-2 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon
            return (
              <div
                key={item.name}
                className={`group relative flex items-center rounded-xl cursor-pointer transition-all duration-200 ${
                  item.active
                    ? "bg-yellow-500 shadow-lg shadow-yellow-500/25 text-green-800"
                    : "hover:bg-green-600/50 text-green-100 hover:text-white"
                } ${isCollapsed ? "justify-center p-3" : "p-3"}`}
                onClick={() => setActiveComponent(item.component)}
              >
                <div className="flex items-center w-full">
                  <div className={`flex items-center justify-center ${isCollapsed ? "" : "mr-3"}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {!isCollapsed && (
                    <>
                      <span className="font-medium text-sm flex-1">{item.name}</span>
                      {item.count && (
                        <Badge
                          variant="secondary"
                          className={`text-xs font-semibold min-w-[24px] h-6 ${
                            item.active
                              ? "bg-green-600 text-yellow-100 border-green-500"
                              : "bg-yellow-500 text-green-800 border-yellow-400"
                          }`}
                        >
                          {item.count}
                        </Badge>
                      )}
                    </>
                  )}
                </div>

                {/* Count badge for collapsed state */}
                {isCollapsed && item.count && (
                  <div className="absolute -top-1 -right-1">
                    <Badge
                      variant="secondary"
                      className="text-xs font-bold min-w-[20px] h-5 bg-yellow-500 text-green-800 border-yellow-400 rounded-full"
                    >
                      {item.count}
                    </Badge>
                  </div>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-green-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg border border-green-600">
                    <div className="font-medium">{item.name}</div>
                    {item.count && <div className="text-xs text-green-200">{item.count} items</div>}
                    {/* Arrow */}
                    <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-green-800 border-l border-b border-green-600 rotate-45"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Settings Section */}
        <div className="pt-6 mt-6 border-t border-green-600/50">
          <div
            className={`group relative flex items-center rounded-xl hover:bg-green-600/50 cursor-pointer transition-all duration-200 text-green-100 hover:text-white ${
              isCollapsed ? "justify-center p-3" : "p-3"
            }`}
          >
            <div className="flex items-center w-full">
              <div className={`flex items-center justify-center ${isCollapsed ? "" : "mr-3"}`}>
                <Settings className="h-5 w-5" />
              </div>
              {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
            </div>

            {/* Tooltip for collapsed state */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-green-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg border border-green-600">
                <div className="font-medium">Settings</div>
                {/* Arrow */}
                <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-green-800 border-l border-b border-green-600 rotate-45"></div>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="pt-6 mt-6 border-t border-green-600/50">
            <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-600/50 cursor-pointer transition-colors">
              <Avatar className="h-8 w-8 border-2 border-yellow-400">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-yellow-500 text-green-800 text-sm font-bold">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">John Doe</p>
                <p className="text-xs text-green-200 truncate">Administrator</p>
              </div>
              <ChevronDown className="h-4 w-4 text-green-200" />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
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

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page
    router.push("/login")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
