"use client"

import { useState } from "react"
import { Plus, Calendar, Clock, Users, Video, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const meetings = [
  {
    id: "MEET-001",
    title: "Client Review Meeting",
    description: "Quarterly review with TechCorp Inc.",
    date: "2024-01-18",
    time: "10:00",
    duration: 60,
    type: "Client Meeting",
    location: "Conference Room A",
    organizer: { name: "John Smith", id: "user1" },
    attendees: [
      { name: "Alice Johnson", email: "alice@techcorp.com", type: "external" },
      { name: "Sarah Johnson", id: "user2", type: "internal" },
    ],
    status: "Scheduled",
    meetingLink: "https://meet.company.com/room/abc123",
  },
  {
    id: "MEET-002",
    title: "Team Standup",
    description: "Daily team synchronization",
    date: "2024-01-17",
    time: "09:00",
    duration: 30,
    type: "Team Meeting",
    location: "Virtual",
    organizer: { name: "Sarah Johnson", id: "user2" },
    attendees: [
      { name: "John Smith", id: "user1", type: "internal" },
      { name: "Mike Wilson", id: "user3", type: "internal" },
    ],
    status: "Completed",
    meetingLink: "https://meet.company.com/room/standup",
  },
]

const contacts = [
  { id: "contact1", name: "Alice Johnson", email: "alice@techcorp.com", company: "TechCorp Inc." },
  { id: "contact2", name: "Bob Wilson", email: "bob@abccorp.com", company: "ABC Corp" },
]

const users = [
  { id: "user1", name: "John Smith", email: "john@company.com" },
  { id: "user2", name: "Sarah Johnson", email: "sarah@company.com" },
  { id: "user3", name: "Mike Wilson", email: "mike@company.com" },
]

export default function MeetingCalendar() {
  const [newMeetingOpen, setNewMeetingOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "60",
    type: "Team Meeting",
    location: "",
    attendees: [],
    meetingLink: "",
  })

  const handleCreateMeeting = () => {
    console.log("Creating meeting:", newMeeting)
    setNewMeetingOpen(false)
    setNewMeeting({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "60",
      type: "Team Meeting",
      location: "",
      attendees: [],
      meetingLink: "",
    })
  }

  const handleShareCalendar = () => {
    console.log("Sharing calendar")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "default"
      case "In Progress":
        return "secondary"
      case "Completed":
        return "outline"
      case "Cancelled":
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
          <h1 className="text-3xl font-bold">Meeting & Calendar</h1>
          <p className="text-muted-foreground">Schedule meetings and manage calendar events</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleShareCalendar}>
            <Users className="h-4 w-4 mr-2" />
            Share Calendar
          </Button>

          <Dialog open={newMeetingOpen} onOpenChange={setNewMeetingOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Meeting</DialogTitle>
                <DialogDescription>Create a new meeting and invite attendees</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    placeholder="Weekly team meeting"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newMeeting.description}
                    onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                    placeholder="Meeting agenda and objectives..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Select
                      value={newMeeting.duration}
                      onValueChange={(value) => setNewMeeting({ ...newMeeting, duration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Meeting Type</Label>
                    <Select
                      value={newMeeting.type}
                      onValueChange={(value) => setNewMeeting({ ...newMeeting, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Team Meeting">Team Meeting</SelectItem>
                        <SelectItem value="Client Meeting">Client Meeting</SelectItem>
                        <SelectItem value="Review Meeting">Review Meeting</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newMeeting.location}
                      onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                      placeholder="Conference Room A or Virtual"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
                  <Input
                    id="meetingLink"
                    value={newMeeting.meetingLink}
                    onChange={(e) => setNewMeeting({ ...newMeeting, meetingLink: e.target.value })}
                    placeholder="https://meet.company.com/room/..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setNewMeetingOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateMeeting}>Schedule Meeting</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="meetings">All Meetings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>View and manage scheduled meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center font-medium text-sm bg-gray-100 rounded">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6 + 1
                  const hasEvent = day === 17 || day === 18
                  return (
                    <div
                      key={i}
                      className={`p-2 h-20 border rounded text-sm ${
                        day > 0 && day <= 31 ? "bg-white" : "bg-gray-50"
                      } ${hasEvent ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      {day > 0 && day <= 31 && (
                        <>
                          <div className="font-medium">{day}</div>
                          {hasEvent && (
                            <div className="mt-1">
                              <div className="text-xs bg-blue-500 text-white px-1 rounded truncate">
                                {day === 17 ? "Standup" : "Client Review"}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Meetings</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search meetings..." className="pl-10 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{meeting.title}</h3>
                          <Badge variant={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                          <Badge variant="outline">{meeting.type}</Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">{meeting.description}</p>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {meeting.date} at {meeting.time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{meeting.duration} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{meeting.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Organizer:</span>
                          <span className="text-sm font-medium">{meeting.organizer.name}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{meeting.attendees.length} attendees</span>
                        </div>
                      </div>

                      {meeting.meetingLink && (
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Your scheduled meetings for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetings
                  .filter((m) => m.status === "Scheduled")
                  .map((meeting) => (
                    <div key={meeting.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold">{new Date(meeting.date).getDate()}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(meeting.date).toLocaleDateString("en", { month: "short" })}
                        </div>
                      </div>

                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold">{meeting.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{meeting.time}</span>
                          <span>•</span>
                          <span>{meeting.duration} min</span>
                          <span>•</span>
                          <span>{meeting.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {meeting.attendees.slice(0, 3).map((attendee, index) => (
                            <Avatar key={index} className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {attendee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {meeting.attendees.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{meeting.attendees.length - 3} more</span>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {meeting.meetingLink && (
                          <Button variant="outline" size="sm">
                            <Video className="h-4 w-4 mr-2" />
                            Join
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
