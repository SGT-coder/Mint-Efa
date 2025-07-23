"use client"

import { useState, useEffect } from "react"
import { Download, BarChart3, PieChart, TrendingUp, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Define DashboardStats type
interface DashboardStats {
  total_cases: number
  open_cases: number
  pending_tasks: number
  total_contacts: number
  cases_by_status: Array<{ status: string; count: number }>
  tasks_by_priority: Array<{ priority: string; count: number }>
  recent_cases: Array<any>
}

export default function ReportsDashboard() {
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [reportType, setReportType] = useState("summary")
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [caseMetrics, setCaseMetrics] = useState<any>(null)
  const [caseMetricsLoading, setCaseMetricsLoading] = useState(false)
  const [caseMetricsError, setCaseMetricsError] = useState<string | null>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null)
  const [performanceLoading, setPerformanceLoading] = useState(false)
  const [performanceError, setPerformanceError] = useState<string | null>(null)
  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date | null) => date ? date.toISOString().split('T')[0] : undefined

  // Fetch dashboard stats from backend
  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      setError(null)
      try {
        let url = "/api/reports/dashboard-stats/"
        const params = []
        if (dateRange.from) params.push(`from=${formatDate(dateRange.from)}`)
        if (dateRange.to) params.push(`to=${formatDate(dateRange.to)}`)
        if (params.length) url += `?${params.join("&")}`
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch dashboard stats")
        const data = await res.json()
        setDashboardStats(data)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [dateRange])

  // Fetch case metrics for Case Reports tab
  useEffect(() => {
    if (reportType !== "cases") return
    async function fetchCaseMetrics() {
      setCaseMetricsLoading(true)
      setCaseMetricsError(null)
      try {
        let url = "/api/reports/case-metrics/"
        const params = []
        if (dateRange.from) params.push(`from=${formatDate(dateRange.from)}`)
        if (dateRange.to) params.push(`to=${formatDate(dateRange.to)}`)
        if (params.length) url += `?${params.join("&")}`
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch case metrics")
        const data = await res.json()
        setCaseMetrics(data)
      } catch (err: any) {
        setCaseMetricsError(err.message || "Unknown error")
      } finally {
        setCaseMetricsLoading(false)
      }
    }
    fetchCaseMetrics()
  }, [reportType, dateRange])
  // Fetch performance metrics for Performance tab
  useEffect(() => {
    if (reportType !== "users") return
    async function fetchPerformanceMetrics() {
      setPerformanceLoading(true)
      setPerformanceError(null)
      try {
        let url = "/api/reports/performance-metrics/"
        const params = []
        if (dateRange.from) params.push(`from=${formatDate(dateRange.from)}`)
        if (dateRange.to) params.push(`to=${formatDate(dateRange.to)}`)
        if (params.length) url += `?${params.join("&")}`
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch performance metrics")
        const data = await res.json()
        setPerformanceMetrics(data)
      } catch (err: any) {
        setPerformanceError(err.message || "Unknown error")
      } finally {
        setPerformanceLoading(false)
      }
    }
    fetchPerformanceMetrics()
  }, [reportType, dateRange])

  const handleGenerateReport = () => {
    console.log("Generating report:", reportType, dateRange)
  }

  const handleExportReport = async (format: string, type: string) => {
    try {
      const res = await fetch(`/api/reports/export/?type=${type}&format=${format}`)
      if (!res.ok) throw new Error("Failed to export report")
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}-report.${format === "pdf" ? "pdf" : "xlsx"}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      alert(err.message || "Unknown error")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading dashboard stats...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (!dashboardStats) {
    return <div className="text-center py-8">No dashboard stats available.</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate reports and analyze system performance</p>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Summary</SelectItem>
              <SelectItem value="cases">Cases</SelectItem>
              <SelectItem value="tasks">Tasks</SelectItem>
              <SelectItem value="users">Users</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange date={dateRange} setDate={setDateRange} />

          <Button onClick={handleGenerateReport}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.total_cases}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.cases_by_status.find(item => item.status === 'Resolved')?.count} resolved this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <p className="text-xs text-muted-foreground">-0.5 days from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2/5</div>
            <p className="text-xs text-muted-foreground">+0.3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">of 45 total users</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cases">Case Reports</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Status Distribution</CardTitle>
                <CardDescription>Current status of all cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Resolved</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{dashboardStats.cases_by_status.find(item => item.status === 'Resolved')?.count}</span>
                      <Badge variant="outline">57%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{dashboardStats.cases_by_status.find(item => item.status === 'In Progress')?.count}</span>
                      <Badge variant="outline">15%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{dashboardStats.cases_by_status.find(item => item.status === 'Pending Review')?.count}</span>
                      <Badge variant="outline">28%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Completion Metrics</CardTitle>
                <CardDescription>Task performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Tasks</span>
                    <span className="text-sm font-medium">{dashboardStats.tasks_by_priority.reduce((sum, item) => sum + item.count, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium text-green-600">{dashboardStats.tasks_by_priority.find(item => item.priority === 'High')?.count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="text-sm font-medium text-blue-600">{dashboardStats.tasks_by_priority.find(item => item.priority === 'Medium')?.count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overdue</span>
                    <span className="text-sm font-medium text-red-600">{dashboardStats.tasks_by_priority.find(item => item.priority === 'Low')?.count}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm">Avg Completion Time</span>
                    <span className="text-sm font-medium">1.8 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Analysis Report</CardTitle>
              <CardDescription>Detailed case metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              {caseMetricsLoading && <div className="text-center py-4">Loading case metrics...</div>}
              {caseMetricsError && <div className="text-center py-4 text-red-500">{caseMetricsError}</div>}
              {caseMetrics && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{caseMetrics.resolved}</div>
                      <div className="text-sm text-muted-foreground">Cases Resolved</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{caseMetrics.in_progress}</div>
                      <div className="text-sm text-muted-foreground">In Progress</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{caseMetrics.pending_review}</div>
                      <div className="text-sm text-muted-foreground">Pending Review</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Case Categories</h4>
                    <div className="space-y-2">
                      {caseMetrics.categories?.map((cat: any) => (
                        <div className="flex items-center justify-between" key={cat.name}>
                          <span className="text-sm">{cat.name}</span>
                          <Badge variant="secondary">{cat.percent}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Individual and team performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {performanceLoading && <div className="text-center py-4">Loading performance metrics...</div>}
              {performanceError && <div className="text-center py-4 text-red-500">{performanceError}</div>}
              {performanceMetrics && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Top Performers</h4>
                      <div className="space-y-2">
                        {performanceMetrics.top_performers?.map((user: any) => (
                          <div className="flex items-center justify-between p-2 border rounded" key={user.name}>
                            <span className="text-sm">{user.name}</span>
                            <Badge variant="default">{user.cases_resolved} cases resolved</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Response Times</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Average First Response</span>
                          <span className="text-sm font-medium">{performanceMetrics.avg_first_response}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Average Resolution</span>
                          <span className="text-sm font-medium">{performanceMetrics.avg_resolution}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">SLA Compliance</span>
                          <span className="text-sm font-medium text-green-600">{performanceMetrics.sla_compliance}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
              <CardDescription>Download reports in various formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Case Summary Report</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete overview of all cases with status and metrics
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleExportReport("pdf", "case-summary")}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport("excel", "case-summary")}>
                        <Download className="h-4 w-4 mr-1" />
                        Excel
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Performance Report</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Team performance metrics and individual statistics
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleExportReport("pdf", "performance")}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport("excel", "performance")}>
                        <Download className="h-4 w-4 mr-1" />
                        Excel
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Task Analysis Report</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Task completion rates and time tracking analysis
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleExportReport("pdf", "task-analysis")}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport("excel", "task-analysis")}>
                        <Download className="h-4 w-4 mr-1" />
                        Excel
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Custom Report</h4>
                    <p className="text-sm text-muted-foreground mb-3">Generate custom reports with selected metrics</p>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleExportReport("pdf", "custom")}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport("excel", "custom")}>
                        <Download className="h-4 w-4 mr-1" />
                        Excel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
