"use client"

import React from "react"
import { useState, useEffect } from "react"
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

// Define Email type
interface Email {
  id: number | string
  from: { name: string; email: string }
  to: string
  subject: string
  body: string
  timestamp: string
  read: boolean
  starred: boolean
  hasAttachment: boolean
  priority: string
  caseId?: string | null
}

export default function EmailInbox() {
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    body: "",
    priority: "Medium",
  })
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  // Fetch emails from backend
  useEffect(() => {
    async function fetchEmails() {
      setLoading(true)
      setError(null)
      try {
        let url = `/api/emails/?`
        if (search) url += `search=${encodeURIComponent(search)}&`
        if (filter && filter !== "all") {
          if (filter === "unread") url += "unread=true&"
          if (filter === "starred") url += "starred=true&"
          if (filter === "high") url += "priority=High&"
        }
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch emails")
        const data = await res.json()
        setEmails(data.results || data)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchEmails()
  }, [search, filter])

  // Send email (draft, then send)
  const handleSendEmail = async () => {
    setLoading(true)
    setError(null)
    try {
      // Create draft
      const res = await fetch("/api/emails/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: newEmail.to,
          subject: newEmail.subject,
          body: newEmail.body,
          from_email: "me@company.com", // Replace with actual sender
        }),
      })
      if (!res.ok) throw new Error("Failed to create email draft")
      const draft = await res.json()
      // Optionally send the email (if you have a send endpoint)
      // await fetch(`/api/emails/${draft.id}/send/`, { method: "POST" })
      // Refetch emails
      const updatedRes = await fetch("/api/emails/")
      const updatedEmails = await updatedRes.json()
      setEmails(updatedEmails.results || updatedEmails)
      setComposeOpen(false)
      setNewEmail({ to: "", subject: "", body: "", priority: "Medium" })
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Update email (e.g., star, archive)
  const handleUpdateEmail = async (emailId: number | string, updates: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/emails/${emailId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error("Failed to update email")
      const updated = await res.json()
      setEmails((prev) => prev.map((e) => e.id === updated.id ? updated : e))
      setSelectedEmail((prev) => prev && prev.id === updated.id ? updated : prev)
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Reply to email
  const handleReply = async (emailId: number | string, replyBody: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/emails/${emailId}/reply/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody }),
      })
      if (!res.ok) throw new Error("Failed to send reply")
      setReplyText("")
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Forward email
  const handleForward = async (emailId: number | string, forwardTo: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/emails/${emailId}/forward/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: forwardTo }),
      })
      if (!res.ok) throw new Error("Failed to forward email")
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Star and archive use handleUpdateEmail
  const handleStarEmail = async (emailId: number | string, starred: boolean) => {
    await handleUpdateEmail(emailId, { starred: !starred })
  }
  const handleArchiveEmail = async (emailId: number | string) => {
    await handleUpdateEmail(emailId, { archived: true })
  }

  const handleCreateCase = async (emailId: number | string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/cases/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailId }),
      })
      if (!res.ok) throw new Error("Failed to create case from email")
      // Optionally refetch emails or update UI
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Fix parameter types for linter
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEmail({ ...newEmail, to: e.target.value })}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEmail({ ...newEmail, subject: e.target.value })}
                  placeholder="Email subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  value={newEmail.body}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewEmail({ ...newEmail, body: e.target.value })}
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
                    <Input
                      placeholder="Search emails..."
                      className="pl-10 w-64"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={filter} onValueChange={setFilter} className="w-32">
                    <SelectTrigger>
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
              {loading && <p className="text-muted-foreground text-center py-4">Loading emails...</p>}
              {error && <p className="text-red-500 text-center py-4">{error}</p>}
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
                      <Button variant="ghost" size="sm" onClick={() => handleStarEmail(selectedEmail.id, selectedEmail.starred)}>
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleArchiveEmail(selectedEmail.id)}>
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteEmail(selectedEmail.id)}>
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
                    <Button size="sm" onClick={() => handleReply(selectedEmail.id, replyText)}>
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleForward(selectedEmail.id, prompt('Forward to email:'))}>
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
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      Template
                    </Button>
                    <Button size="sm" onClick={() => handleReply(selectedEmail.id, replyText)}>
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
