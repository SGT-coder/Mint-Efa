"use client"

import { useState } from "react"
import { Download, BarChart3, PieChart, TrendingUp, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const reportData = {
  caseMetrics: {
    total: 156,
    resolved: 89,
    inProgress: 24,
    pending: 43,
    avgResolutionTime: "2.3 days",
    satisfactionScore: 4.2,
  },
  taskMetrics: {
    total: 234,
    completed: 178,
    inProgress: 32,
    overdue: 24,
    avgCompletionTime: "1.8 days",
  },
  userMetrics: {
    totalUsers: 45,
    activeUsers: 38,
    avgCasesPerUser: 3.5,
    topPerformer: "John Smith",
  },
}

export default function ReportsDashboard() {
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [reportType, setReportType] = useState("summary")

  const handleGenerateReport = () => {
    console.log("Generating report:", reportType, dateRange)
  }

  const handleExportReport = (format) => {
    console.log("Exporting report as:", format)
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
            <div className="text-2xl font-bold">{reportData.caseMetrics.total}</div>
            <p className="text-xs text-muted-foreground">{reportData.caseMetrics.resolved} resolved this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.caseMetrics.avgResolutionTime}</div>
            <p className="text-xs text-muted-foreground">-0.5 days from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.caseMetrics.satisfactionScore}/5</div>
            <p className="text-xs text-muted-foreground">+0.3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.userMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">of {reportData.userMetrics.totalUsers} total users</p>
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
                      <span className="text-sm font-medium">{reportData.caseMetrics.resolved}</span>
                      <Badge variant="outline">57%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{reportData.caseMetrics.inProgress}</span>
                      <Badge variant="outline">15%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{reportData.caseMetrics.pending}</span>
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
                    <span className="text-sm font-medium">{reportData.taskMetrics.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium text-green-600">{reportData.taskMetrics.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="text-sm font-medium text-blue-600">{reportData.taskMetrics.inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overdue</span>
                    <span className="text-sm font-medium text-red-600">{reportData.taskMetrics.overdue}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm">Avg Completion Time</span>
                    <span className="text-sm font-medium">{reportData.taskMetrics.avgCompletionTime}</span>
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">89</div>
                    <div className="text-sm text-muted-foreground">Cases Resolved</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">43</div>
                    <div className="text-sm text-muted-foreground">Pending Review</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Case Categories</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Technical Issues</span>
                      <Badge variant="secondary">45%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Configuration</span>
                      <Badge variant="secondary">28%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Access Requests</span>
                      <Badge variant="secondary">18%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">General Inquiries</span>
                      <Badge variant="secondary">9%</Badge>
                    </div>
                  </div>
                </div>
              </div>
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Top Performers</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">John Smith</span>
                        <Badge variant="default">15 cases resolved</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Sarah Johnson</span>
                        <Badge variant="secondary">12 cases resolved</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Mike Wilson</span>
                        <Badge variant="secondary">10 cases resolved</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Response Times</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average First Response</span>
                        <span className="text-sm font-medium">2.4 hours</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Resolution</span>
                        <span className="text-sm font-medium">2.3 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SLA Compliance</span>
                        <span className="text-sm font-medium text-green-600">94%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                      <Button size="sm" onClick={() => handleExportReport("pdf")}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport("excel")}>
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
                      <Button size="sm" onClick={() => handleExportReport("pdf")}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport("excel")}>
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
                      <Button size="sm" onClick={() => handleExportReport("pdf")}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport("excel")}>
                        <Download className="h-4 w-4 mr-1" />
                        Excel
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Custom Report</h4>
                    <p className="text-sm text-muted-foreground mb-3">Generate custom reports with selected metrics</p>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleExportReport("pdf")}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport("excel")}>
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
