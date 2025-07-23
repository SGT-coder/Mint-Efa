"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function UserFiles() {
  const { t } = useTranslation("en")

  const files = [
    { name: "Contract_2024.pdf", type: "PDF", uploadDate: "2025-05-20" },
    { name: "Support_Ticket_Details.docx", type: "DOCX", uploadDate: "2025-06-01" },
    { name: "Invoice_Q2_2025.xlsx", type: "XLSX", uploadDate: "2025-07-01" },
  ]

  const handleUploadFile = () => {
    console.log("Upload file initiated.")
    // Add file upload logic here
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t("my_files")}</CardTitle>
        <CardDescription>Access and manage your associated documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-end">
          <Button onClick={handleUploadFile} className="bg-green-600 hover:bg-green-700 text-white">
            <Upload className="mr-2 h-4 w-4" /> {t("upload_file")}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("file_name")}</TableHead>
              <TableHead>{t("file_type")}</TableHead>
              <TableHead>{t("upload_date")}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{file.name}</TableCell>
                <TableCell>{file.type}</TableCell>
                <TableCell>{file.uploadDate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> {t("download")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
