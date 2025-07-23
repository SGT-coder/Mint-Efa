"use client"

import { useState, useEffect } from "react"
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
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, format } from "date-fns"

// Define Meeting type
interface Meeting {
  id: number | string
  title: string
  description: string
  date: string
  time: string
  duration: number | string
  type: string
  location: string
  organizer: { name: string; id: string }
  attendees: Array<{ name: string; email?: string; id?: string; type: string }>
  status: string
  meetingLink?: string
}

const [users, setUsers] = useState<{ id: string; name: string; email?: string }[]>([])
const [usersLoading, setUsersLoading] = useState(false)
const [usersError, setUsersError] = useState<string | null>(null)
const [contacts, setContacts] = useState<{ id: string; name: string; email?: string }[]>([])
const [contactsLoading, setContactsLoading] = useState(false)
const [contactsError, setContactsError] = useState<string | null>(null)
const [search, setSearch] = useState("")
const [calendarMonth, setCalendarMonth] = useState(new Date())
const [page, setPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)

export default function MeetingCalendar() {
  const [newMeetingOpen, setNewMeetingOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
  const [editMeetingOpen, setEditMeetingOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [editMeetingLoading, setEditMeetingLoading] = useState(false)
  const [editMeetingError, setEditMeetingError] = useState<string | null>(null)
  const [deleteMeetingId, setDeleteMeetingId] = useState<string | number | null>(null)
  const [deleteMeetingLoading, setDeleteMeetingLoading] = useState(false)
  const [deleteMeetingError, setDeleteMeetingError] = useState<string | null>(null)

  // Fetch meetings from backend
  useEffect(() => {
    async function fetchMeetings() {
      setLoading(true)
      setError(null)
      try {
        let url = `/api/meetings/?page=${page}`
        if (search) url += `&search=${encodeURIComponent(search)}`
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch meetings")
        const data = await res.json()
        setMeetings(data.results || data)
        setTotalPages(data.total_pages || 1)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchMeetings()
  }, [search, page])

  // Fetch users for organizer/attendees
  useEffect(() => {
    async function fetchUsers() {
      setUsersLoading(true)
      setUsersError(null)
      try {
        const res = await fetch("/api/auth/users/")
        if (!res.ok) throw new Error("Failed to fetch users")
        const data = await res.json()
        setUsers(data)
      } catch (err: any) {
        setUsersError(err.message || "Unknown error")
      } finally {
        setUsersLoading(false)
      }
    }
    fetchUsers()
  }, [])
  // Fetch contacts for attendees
  useEffect(() => {
    async function fetchContacts() {
      setContactsLoading(true)
      setContactsError(null)
      try {
        const res = await fetch("/api/contacts/")
        if (!res.ok) throw new Error("Failed to fetch contacts")
        const data = await res.json()
        setContacts(data.results || data)
      } catch (err: any) {
        setContactsError(err.message || "Unknown error")
      } finally {
        setContactsLoading(false)
      }
    }
    fetchContacts()
  }, [])

  // Create meeting
  const handleCreateMeeting = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/meetings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeeting),
      })
      if (!res.ok) throw new Error("Failed to create meeting")
      const created: Meeting = await res.json()
      setMeetings((prev) => [...prev, created])
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
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
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

  // Helper to get all days in the current calendar month view
  const getCalendarDays = () => {
    const start = startOfWeek(startOfMonth(calendarMonth), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(calendarMonth), { weekStartsOn: 0 })
    const days = []
    let day = start
    while (day <= end) {
      days.push(day)
      day = addDays(day, 1)
    }
    return days
  }

  // Edit meeting handlers
  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting)
    setEditMeetingOpen(true)
  }
  const handleUpdateMeeting = async () => {
    if (!editingMeeting) return
    setEditMeetingLoading(true)
    setEditMeetingError(null)
    try {
      const res = await fetch(`/api/meetings/${editingMeeting.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMeeting),
      })
      if (!res.ok) throw new Error("Failed to update meeting")
      const updated: Meeting = await res.json()
      setMeetings((prev) => prev.map((m) => m.id === updated.id ? updated : m))
      setEditMeetingOpen(false)
      setEditingMeeting(null)
    } catch (err: any) {
      setEditMeetingError(err.message || "Unknown error")
    } finally {
      setEditMeetingLoading(false)
    }
  }
  // Delete meeting handlers
  const handleDeleteMeeting = (meetingId: string | number) => {
    setDeleteMeetingId(meetingId)
  }
  const confirmDeleteMeeting = async () => {
    if (!deleteMeetingId) return
    setDeleteMeetingLoading(true)
    setDeleteMeetingError(null)
    try {
      const res = await fetch(`/api/meetings/${deleteMeetingId}/`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete meeting")
      setMeetings((prev) => prev.filter((m) => m.id !== deleteMeetingId))
      setDeleteMeetingId(null)
    } catch (err: any) {
      setDeleteMeetingError(err.message || "Unknown error")
    } finally {
      setDeleteMeetingLoading(false)
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

                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizer</Label>
                  <Select
                    value={newMeeting.organizer || ""}
                    onValueChange={value => setNewMeeting({ ...newMeeting, organizer: value })}
                    disabled={usersLoading || !!usersError}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={usersLoading ? "Loading..." : usersError ? "Error" : "Select organizer"} />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {usersError && <p className="text-red-500 text-xs mt-1">{usersError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attendees">Attendees</Label>
                  <div className="flex flex-wrap gap-2">
                    {contacts.map((contact) => (
                      <label key={contact.id} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={newMeeting.attendees?.includes(contact.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setNewMeeting({ ...newMeeting, attendees: [...(newMeeting.attendees || []), contact.id] })
                            } else {
                              setNewMeeting({ ...newMeeting, attendees: (newMeeting.attendees || []).filter((id: string) => id !== contact.id) })
                            }
                          }}
                        />
                        <span>{contact.name}</span>
                      </label>
                    ))}
                  </div>
                  {contactsError && <p className="text-red-500 text-xs mt-1">{contactsError}</p>}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setNewMeetingOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateMeeting}>Schedule Meeting</Button>
                </div>
              </div>
              {(loading || usersLoading || contactsLoading) && <p className="text-muted-foreground text-center py-2">Loading...</p>}
              {error && <p className="text-red-500 text-center py-2">{error}</p>}
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
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => setCalendarMonth(addDays(calendarMonth, -30))}>Previous</Button>
                <span className="text-sm font-medium">{format(calendarMonth, "MMMM yyyy")}</span>
                <Button variant="outline" size="sm" onClick={() => setCalendarMonth(addDays(calendarMonth, 30))}>Next</Button>
              </div>
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
                {getCalendarDays().map((day, i) => {
                  const dayMeetings = meetings.filter(m => m.date && isSameDay(new Date(m.date), day))
                  return (
                    <div
                      key={i}
                      className={`p-2 h-24 border rounded text-sm ${
                        day.getMonth() === calendarMonth.getMonth() ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">{day.getDate()}</div>
                      {dayMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="mt-1 text-xs bg-blue-500 text-white px-1 rounded truncate cursor-pointer"
                          title={meeting.title}
                          onClick={() => setSelectedMeeting(meeting)}
                        >
                          {meeting.title}
                        </div>
                      ))}
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
                  <Input
                    placeholder="Search meetings..."
                    className="pl-10 w-64"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading && <p className="text-muted-foreground text-center py-4">Loading meetings...</p>}
              {error && <p className="text-red-500 text-center py-4">{error}</p>}
              <div className="space-y-4">
                {meetings.length === 0 ? (
                  <p>No meetings found. Schedule a new one!</p>
                ) : (
                  meetings.map((meeting) => (
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
                        <Button variant="outline" size="sm" onClick={() => handleEditMeeting(meeting)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteMeeting(meeting.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                    Previous
                  </Button>
                  <span className="text-sm">Page {page} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                    Next
                  </Button>
                </div>
              )}
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

      {/* Edit Meeting Dialog */}
      <Dialog open={editMeetingOpen} onOpenChange={setEditMeetingOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Meeting</DialogTitle>
            <DialogDescription>Edit the details of the meeting.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Meeting Title</Label>
              <Input
                id="edit-title"
                value={editingMeeting?.title || ""}
                onChange={e => setEditingMeeting(editingMeeting ? { ...editingMeeting, title: e.target.value } : null)}
                placeholder="Meeting Title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingMeeting?.description || ""}
                onChange={e => setEditingMeeting(editingMeeting ? { ...editingMeeting, description: e.target.value } : null)}
                placeholder="Description"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingMeeting?.date || ""}
                  onChange={e => setEditingMeeting(editingMeeting ? { ...editingMeeting, date: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editingMeeting?.time || ""}
                  onChange={e => setEditingMeeting(editingMeeting ? { ...editingMeeting, time: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (min)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={editingMeeting?.duration || ""}
                  onChange={e => setEditingMeeting(editingMeeting ? { ...editingMeeting, duration: e.target.value } : null)}
                  placeholder="60"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Meeting Type</Label>
                <Select
                  value={editingMeeting?.type || ""}
                  onValueChange={value => setEditingMeeting(editingMeeting ? { ...editingMeeting, type: value } : null)}
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
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editingMeeting?.location || ""}
                  onChange={e => setEditingMeeting(editingMeeting ? { ...editingMeeting, location: e.target.value } : null)}
                  placeholder="Location"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-meetingLink">Meeting Link (Optional)</Label>
              <Input
                id="edit-meetingLink"
                value={editingMeeting?.meetingLink || ""}
                onChange={e => setEditingMeeting(editingMeeting ? { ...editingMeeting, meetingLink: e.target.value } : null)}
                placeholder="https://meet.company.com/room/..."
              />
            </div>
            {editMeetingLoading && <p className="text-muted-foreground text-center py-2">Updating meeting...</p>}
            {editMeetingError && <p className="text-red-500 text-center py-2">{editMeetingError}</p>}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditMeetingOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMeeting} disabled={editMeetingLoading}>
                {editMeetingLoading ? "Updating..." : "Update Meeting"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Meeting Confirm Dialog */}
      <Dialog open={!!deleteMeetingId} onOpenChange={open => { if (!open) setDeleteMeetingId(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Meeting</DialogTitle>
            <DialogDescription>Are you sure you want to delete this meeting?</DialogDescription>
          </DialogHeader>
          {deleteMeetingLoading && <p className="text-muted-foreground text-center py-2">Deleting meeting...</p>}
          {deleteMeetingError && <p className="text-red-500 text-center py-2">{deleteMeetingError}</p>}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteMeetingId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteMeeting} disabled={deleteMeetingLoading}>
              {deleteMeetingLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meeting details modal */}
      <Dialog open={!!selectedMeeting} onOpenChange={open => { if (!open) setSelectedMeeting(null) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Meeting Details</DialogTitle>
            <DialogDescription>Full details for the selected meeting.</DialogDescription>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-1">{selectedMeeting.title}</h2>
                <p className="text-muted-foreground mb-2">{selectedMeeting.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span>Date: {selectedMeeting.date}</span>
                  <span>Time: {selectedMeeting.time}</span>
                  <span>Duration: {selectedMeeting.duration} min</span>
                  <span>Type: {selectedMeeting.type}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span>Location: {selectedMeeting.location}</span>
                  <span>Status: {selectedMeeting.status}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Organizer</h3>
                <p>{selectedMeeting.organizer?.name || selectedMeeting.organizer}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Attendees</h3>
                <ul className="list-disc pl-5">
                  {selectedMeeting.attendees?.map((a, i) => (
                    <li key={i}>{a.name || a.email || a}</li>
                  ))}
                </ul>
              </div>
              {selectedMeeting.meetingLink && (
                <div>
                  <Button asChild variant="outline">
                    <a href={selectedMeeting.meetingLink} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </Button>
                </div>
              )}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedMeeting(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
