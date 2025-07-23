"use client"

import { useState } from "react"
import { Search, Plus, Reply, Forward, Archive, Trash2, Star, Paperclip, Send } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

const emails = [
  {
    id: "email1",
    from: { name: "Alice Johnson", email: "alice@techcorp.com" },
    to: "support@company.com",
    subject: "Server connectivity issues",
    body: "We are experiencing intermittent server connectivity issues that are affecting our daily operations. This started yesterday around 3 PM and continues to persist. Can you please investigate and provide an update?",
    timestamp: "2024-01-16 14:30",
    read: false,
    starred: true,
    hasAttachment: false,
    priority: "High",
    caseId: "CASE-001",
  },
  {
    id: "email2",
    from: { name: "Bob Wilson", email: "bob@abccorp.com" },
    to: "support@company.com",
    subject: "Email configuration help needed",
    body: "I need assistance with configuring email settings for our new domain. The current setup is not working properly and emails are not being delivered.",
    timestamp: "2024-01-16 11:15",
    read: true,
    starred: false,
    hasAttachment: true,
    priority: "Medium",
    caseId: "CASE-002",
  },
  {
    id: "email3",
    from: { name: "System", email: "system@company.com" },
    to: "admin@company.com",
    subject: "Daily backup report",
    body: "Daily backup completed successfully. All systems backed up at 2:00 AM. No errors reported.",
    timestamp: "2024-01-16 02:00",
    read: true,
    starred: false,
    hasAttachment: false,
    priority: "Low",
    caseId: null,
  },
]

export default function EmailInbox() {
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    body: "",
    priority: "Medium",
  })

  const handleSendEmail = () => {
    console.log("Sending email:", newEmail)
    setComposeOpen(false)
    setNewEmail({
      to: "",
      subject: "",
      body: "",
      priority: "Medium",
    })
  }

  const handleReply = (emailId) => {
    console.log("Replying to email:", emailId, "with:", replyText)
    setReplyText("")
  }

  const handleCreateCase = (emailId) => {
    console.log("Creating case from email:", emailId)
  }

  const getPriorityColor = (priority) => {
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
          <h1 className="text-3xl font-bold">Email Inbox</h1>
          <p className="text-muted-foreground">Manage customer communications and support emails</p>
        </div>

        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose Email</DialogTitle>
              <DialogDescription>Send a new email message</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    value={newEmail.to}
                    onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                    placeholder="recipient@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newEmail.priority}
                    onValueChange={(value) => setNewEmail({ ...newEmail, priority: value })}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newEmail.subject}
                  onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                  placeholder="Email subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  value={newEmail.body}
                  onChange={(e) => setNewEmail({ ...newEmail, body: e.target.value })}
                  placeholder="Type your message here..."
                  rows={8}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setComposeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendEmail}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inbox</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search emails..." className="pl-10 w-64" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="starred">Starred</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedEmail?.id === email.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    } ${!email.read ? "bg-blue-50/30 border-blue-200" : ""}`}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox />
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {email.from.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${!email.read ? "font-bold" : ""}`}>{email.from.name}</span>
                            <Badge variant={getPriorityColor(email.priority)} className="text-xs">
                              {email.priority}
                            </Badge>
                            {email.caseId && (
                              <Badge variant="outline" className="text-xs">
                                {email.caseId}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {email.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            {email.hasAttachment && <Paperclip className="h-4 w-4 text-gray-500" />}
                            <span className="text-xs text-muted-foreground">{email.timestamp}</span>
                          </div>
                        </div>

                        <h3 className={`text-sm ${!email.read ? "font-semibold" : ""}`}>{email.subject}</h3>

                        <p className="text-sm text-muted-foreground line-clamp-2">{email.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Details */}
        <div className="space-y-4">
          {selectedEmail ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Email Details</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {selectedEmail.from.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedEmail.from.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedEmail.from.email}</p>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>To: {selectedEmail.to}</p>
                      <p>Date: {selectedEmail.timestamp}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{selectedEmail.subject}</h3>
                      <Badge variant={getPriorityColor(selectedEmail.priority)}>{selectedEmail.priority}</Badge>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{selectedEmail.body}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm">
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      <Forward className="h-4 w-4 mr-2" />
                      Forward
                    </Button>
                    {!selectedEmail.caseId && (
                      <Button variant="outline" size="sm" onClick={() => handleCreateCase(selectedEmail.id)}>
                        Create Case
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Reply</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      Template
                    </Button>
                    <Button size="sm" onClick={() => handleReply(selectedEmail.id)}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Select an email to view details</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
