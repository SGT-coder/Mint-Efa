"use client"

import { useState, useEffect } from "react"
import { Upload, Search, Download, Eye, Trash2, FileText, ImageIcon, File, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Define Document type
interface Document {
  id: number | string
  name: string
  type: string
  size: string
  uploadedBy: string
  uploadDate: string
  category: string
  caseId?: string | null
  tags: string[]
  status: string
}

const folders = [
  { id: "folder1", name: "Technical Documentation", count: 15 },
  { id: "folder2", name: "User Manuals", count: 8 },
  { id: "folder3", name: "System Diagrams", count: 12 },
  { id: "folder4", name: "Procedures", count: 6 },
]

export default function DocumentManagement() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [newFolder, setNewFolder] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [folders, setFolders] = useState<{ id: string; name: string; count: number }[]>([])
  const [editDocOpen, setEditDocOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState<any | null>(null)
  const [editDocLoading, setEditDocLoading] = useState(false)
  const [editDocError, setEditDocError] = useState<string | null>(null)

  // Fetch documents with search, type, and pagination
  useEffect(() => {
    async function fetchDocuments() {
      setLoading(true)
      setError(null)
      try {
        let url = `/api/documents/?page=${page}`
        if (search) url += `&search=${encodeURIComponent(search)}`
        if (type && type !== "all") url += `&type=${encodeURIComponent(type)}`
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch documents")
        const data = await res.json()
        setDocuments(data.results || data)
        setTotalPages(data.total_pages || 1)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchDocuments()
  }, [search, type, page])

  // Aggregate folders from documents whenever documents change
  useEffect(() => {
    const folderMap: Record<string, { id: string; name: string; count: number }> = {}
    documents.forEach((doc) => {
      const folderName = doc.category || "Uncategorized"
      if (!folderMap[folderName]) {
        folderMap[folderName] = {
          id: folderName,
          name: folderName,
          count: 0,
        }
      }
      folderMap[folderName].count += 1
    })
    setFolders(Object.values(folderMap))
  }, [documents])

  // Upload document(s)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
    if (files.length === 0) return
    setUploadProgress(0)
    setLoading(true)
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        // Add other fields as needed (category, caseId, etc.)
        const res = await fetch("/api/documents/", {
          method: "POST",
          body: formData,
        })
        if (!res.ok) throw new Error("Failed to upload document")
        const uploaded: Document = await res.json()
        setDocuments((prev) => [...prev, uploaded])
      }
      setUploadProgress(100)
      setTimeout(() => {
        setUploadOpen(false)
        setSelectedFiles([])
        setUploadProgress(0)
      }, 1000)
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Preview document
  const handlePreview = (doc: any) => {
    if (doc.file_url) {
      window.open(doc.file_url, "_blank")
    } else {
      alert("No file URL available for preview.")
    }
  }
  // Download document
  const handleDownload = (doc: any) => {
    if (doc.file_url) {
      const link = document.createElement("a")
      link.href = doc.file_url
      link.download = doc.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert("No file URL available for download.")
    }
  }

  const handleDelete = async (docId: number | string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/documents/${docId}/`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete document")
      setDocuments((prev) => prev.filter((d) => d.id !== docId))
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Edit document
  const handleEditDoc = (doc: any) => {
    setEditingDoc(doc)
    setEditDocOpen(true)
  }
  const handleUpdateDoc = async () => {
    if (!editingDoc) return
    setEditDocLoading(true)
    setEditDocError(null)
    try {
      const res = await fetch(`/api/documents/${editingDoc.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDoc),
      })
      if (!res.ok) throw new Error("Failed to update document")
      const updated = await res.json()
      setDocuments((prev) => prev.map((d) => d.id === updated.id ? updated : d))
      setEditDocOpen(false)
      setEditingDoc(null)
    } catch (err: any) {
      setEditDocError(err.message || "Unknown error")
    } finally {
      setEditDocLoading(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />
      case "image":
        return <ImageIcon className="h-8 w-8 text-blue-500" />
      case "document":
        return <File className="h-8 w-8 text-blue-600" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">Upload, organize, and manage documents</p>
        </div>

        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Folder className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>Create a new folder to organize documents</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    placeholder="Enter folder name"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Folder</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Documents</DialogTitle>
                <DialogDescription>Upload files to the document library</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, GIF (Max 10MB each)
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Select Files
                    </label>
                  </Button>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Selected Files:</h4>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    ))}

                    {uploadProgress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} />
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Documentation</SelectItem>
                        <SelectItem value="procedures">Procedures</SelectItem>
                        <SelectItem value="diagrams">Diagrams</SelectItem>
                        <SelectItem value="manuals">User Manuals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Related Case (Optional)</Label>
                    <Input placeholder="CASE-001" />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">All Documents</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Document Library</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search documents..." className="pl-10 w-64" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  placeholder="Search documents..."
                  className="w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Select value={type} onValueChange={setType} defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <p>Loading documents...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : documents.length === 0 ? (
                  <p>No documents found. Upload some!</p>
                ) : (
                  documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                          {getFileIcon(doc.type)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{doc.name}</h3>
                            <p className="text-sm text-muted-foreground">{doc.size}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {doc.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="text-sm text-muted-foreground">
                            <p>Category: {doc.category}</p>
                            <p>Uploaded by: {doc.uploadedBy}</p>
                            <p>Date: {doc.uploadDate}</p>
                            {doc.caseId && <p>Case: {doc.caseId}</p>}
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handlePreview(doc)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditDoc(doc)}>
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

        <TabsContent value="folders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Folder Structure</CardTitle>
              <CardDescription>Organize documents into folders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <Card key={folder.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3">
                        <Folder className="h-12 w-12 text-blue-500" />
                        <div>
                          <h3 className="font-semibold">{folder.name}</h3>
                          <p className="text-sm text-muted-foreground">{folder.count} files</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recently uploaded and modified documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents
                  .slice()
                  .sort((a, b) => new Date(b.uploadDate || b.created_at).getTime() - new Date(a.uploadDate || a.created_at).getTime())
                  .slice(0, 5)
                  .map((doc) => (
                    <div key={doc.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      {getFileIcon(doc.type)}
                      <div className="flex-1">
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Uploaded by {doc.uploadedBy} on {doc.uploadDate || doc.created_at}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handlePreview(doc)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editDocOpen} onOpenChange={setEditDocOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>Update the details of the document.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-doc-name">Document Name</Label>
              <Input
                id="edit-doc-name"
                value={editingDoc?.name || ""}
                onChange={(e) => setEditingDoc({ ...editingDoc, name: e.target.value })}
                placeholder="Document Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-doc-category">Category</Label>
              <Input
                id="edit-doc-category"
                value={editingDoc?.category || ""}
                onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
                placeholder="Category"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-doc-tags">Tags (comma separated)</Label>
              <Input
                id="edit-doc-tags"
                value={editingDoc?.tags ? editingDoc.tags.join(", ") : ""}
                onChange={(e) => setEditingDoc({ ...editingDoc, tags: e.target.value.split(",").map((t: string) => t.trim()) })}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            {editDocError && <p className="text-red-500 text-sm">{editDocError}</p>}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditDocOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateDoc} disabled={editDocLoading}>
                {editDocLoading ? "Updating..." : "Update Document"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
