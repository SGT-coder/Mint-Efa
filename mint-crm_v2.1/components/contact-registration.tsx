"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Building, Mail, Phone, MapPin } from "lucide-react"
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

// Define Contact type
interface Contact {
  id: number | string
  name: string
  email: string
  phone: string
  company: string
  position: string
  department: string
  address: string
  status?: string
  lastContact?: string
  cases?: number
  notes?: string
  tags: string[]
  created_at?: string
  updated_at?: string
}

const companies = [
  { id: "company1", name: "TechCorp Inc.", industry: "Technology" },
  { id: "company2", name: "ABC Corp", industry: "Manufacturing" },
  { id: "company3", name: "DataFlow Ltd", industry: "Data Services" },
]

export default function ContactRegistration() {
  const [newContactOpen, setNewContactOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    department: "",
    address: "",
    notes: "",
    tags: [],
  })
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [companies, setCompanies] = useState<{ id: string; name: string; industry?: string; count: number }[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [editContactOpen, setEditContactOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<any | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsContact, setDetailsContact] = useState<any | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  // Fetch contacts with search and pagination
  useEffect(() => {
    async function fetchContacts() {
      setLoading(true)
      setError(null)
      try {
        let url = `/api/contacts/?page=${page}`
        if (search) url += `&search=${encodeURIComponent(search)}`
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch contacts")
        const data = await res.json()
        setContacts(data.results || data)
        setTotalPages(data.total_pages || 1)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchContacts()
  }, [search, page])

  // Aggregate companies from contacts whenever contacts change
  useEffect(() => {
    const companyMap: Record<string, { id: string; name: string; industry?: string; count: number }> = {}
    contacts.forEach((contact) => {
      const companyId = contact.company || "Unknown"
      if (!companyMap[companyId]) {
        companyMap[companyId] = {
          id: companyId,
          name: contact.company || "Unknown",
          industry: contact.industry || undefined,
          count: 0,
        }
      }
      companyMap[companyId].count += 1
    })
    setCompanies(Object.values(companyMap))
  }, [contacts])

  // Synthesize recent activity from contacts whenever contacts change
  useEffect(() => {
    const activity = contacts
      .filter((c) => c.created_at || c.updated_at)
      .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
      .slice(0, 10)
      .map((c) => ({
        id: c.id,
        name: c.name,
        action: c.updated_at && c.updated_at !== c.created_at ? "updated" : "created",
        timestamp: c.updated_at || c.created_at,
        email: c.email,
      }))
    setRecentActivity(activity)
  }, [contacts])

  // Create contact
  const handleCreateContact = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/contacts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      })
      if (!res.ok) throw new Error("Failed to create contact")
      const created: Contact = await res.json()
      setContacts((prev) => [...prev, created])
      setNewContactOpen(false)
      setNewContact({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        department: "",
        address: "",
        notes: "",
        tags: [],
      })
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Edit contact
  const handleEditContact = (contact: any) => {
    setEditingContact(contact)
    setEditContactOpen(true)
  }
  const handleUpdateContact = async () => {
    if (!editingContact) return
    setEditLoading(true)
    setEditError(null)
    try {
      const res = await fetch(`/api/contacts/${editingContact.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingContact),
      })
      if (!res.ok) throw new Error("Failed to update contact")
      const updated = await res.json()
      setContacts((prev) => prev.map((c) => c.id === updated.id ? updated : c))
      setEditContactOpen(false)
      setEditingContact(null)
    } catch (err: any) {
      setEditError(err.message || "Unknown error")
    } finally {
      setEditLoading(false)
    }
  }

  // Delete contact
  const handleDeleteContact = async (contactId: number | string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/contacts/${contactId}/`, {
        method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete contact")
      setContacts((prev) => prev.filter((c) => c.id !== contactId))
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Show contact details modal
  const handleShowDetails = async (contact: any) => {
    setDetailsOpen(true)
    setDetailsContact(null)
    setDetailsLoading(true)
    setDetailsError(null)
    try {
      const res = await fetch(`/api/contacts/${contact.id}/`)
      if (!res.ok) throw new Error("Failed to fetch contact details")
      const data = await res.json()
      setDetailsContact(data)
    } catch (err: any) {
      setDetailsError(err.message || "Unknown error")
    } finally {
      setDetailsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contact Registration</h1>
          <p className="text-muted-foreground">Register and manage customer contacts</p>
        </div>

        <Dialog open={newContactOpen} onOpenChange={setNewContactOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Register New Contact</DialogTitle>
              <DialogDescription>Add a new customer contact to the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="john.doe@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Select
                    value={newContact.company}
                    onValueChange={(value) => setNewContact({ ...newContact, company: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newContact.position}
                    onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
                    placeholder="IT Director"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newContact.department}
                    onChange={(e) => setNewContact({ ...newContact, department: e.target.value })}
                    placeholder="Information Technology"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newContact.address}
                  onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
                  placeholder="123 Business Street, City, State 12345"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newContact.notes}
                  onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                  placeholder="Additional notes about this contact..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setNewContactOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateContact}>Register Contact</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contacts">All Contacts</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contact Directory</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search contacts..." className="pl-10 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  placeholder="Search contacts..."
                  className="w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <p>Loading contacts...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : contacts.length === 0 ? (
                  <p>No contacts found. Add a new one!</p>
                ) : (
                  contacts.map((contact) => (
                    <Card key={contact.id} className="hover:shadow-md transition-shadow" onClick={() => handleShowDetails(contact)}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>
                                {contact.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{contact.name}</CardTitle>
                              <CardDescription>{contact.position}</CardDescription>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEditContact(contact)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteContact(contact.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{contact.company}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{contact.address}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-2">
                            <Badge variant={contact.status === "Active" ? "default" : "secondary"}>
                              {contact.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{contact.cases} cases</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Last: {contact.lastContact}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              <div className="flex justify-center items-center space-x-4 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Directory</CardTitle>
              <CardDescription>Manage customer companies and organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {company.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">{company.industry || ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{company.count} contacts</span>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Contact Activity</CardTitle>
              <CardDescription>Latest interactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div>No recent activity.</div>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {activity.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.name} {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()} • {activity.email}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editContactOpen} onOpenChange={setEditContactOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update the details of the contact.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingContact?.name || ""}
                  onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingContact?.email || ""}
                  onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                  placeholder="john.doe@company.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingContact?.phone || ""}
                  onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={editingContact?.company || ""}
                  onChange={(e) => setEditingContact({ ...editingContact, company: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  value={editingContact?.position || ""}
                  onChange={(e) => setEditingContact({ ...editingContact, position: e.target.value })}
                  placeholder="IT Director"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={editingContact?.department || ""}
                  onChange={(e) => setEditingContact({ ...editingContact, department: e.target.value })}
                  placeholder="Information Technology"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={editingContact?.address || ""}
                onChange={(e) => setEditingContact({ ...editingContact, address: e.target.value })}
                placeholder="123 Business Street, City, State 12345"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={editingContact?.notes || ""}
                onChange={(e) => setEditingContact({ ...editingContact, notes: e.target.value })}
                placeholder="Additional notes about this contact..."
                rows={3}
              />
            </div>
            {editError && <p className="text-red-500 text-sm">{editError}</p>}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditContactOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateContact} disabled={editLoading}>
                {editLoading ? "Updating..." : "Update Contact"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>Full information for this contact.</DialogDescription>
          </DialogHeader>
          {detailsLoading ? (
            <div>Loading...</div>
          ) : detailsError ? (
            <div className="text-red-500">{detailsError}</div>
          ) : detailsContact ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {detailsContact.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{detailsContact.name}</h3>
                  <p className="text-sm text-muted-foreground">{detailsContact.position} • {detailsContact.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p>{detailsContact.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p>{detailsContact.phone}</p>
                </div>
                <div>
                  <Label>Company</Label>
                  <p>{detailsContact.company}</p>
                </div>
                <div>
                  <Label>Address</Label>
                  <p>{detailsContact.address}</p>
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <p>{detailsContact.notes}</p>
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1">
                  {detailsContact.tags && detailsContact.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Created: {detailsContact.created_at && new Date(detailsContact.created_at).toLocaleString()}<br />
                Updated: {detailsContact.updated_at && new Date(detailsContact.updated_at).toLocaleString()}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
