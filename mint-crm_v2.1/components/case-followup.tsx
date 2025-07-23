"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"

export default function CaseFollowup() {
  const { t } = useTranslation("en")

  const cases = [
    { id: "C-001", subject: "Product Inquiry", status: "Open", lastUpdated: "2025-07-10" },
    { id: "C-002", subject: "Service Request", status: "Pending", lastUpdated: "2025-07-08" },
    { id: "C-003", subject: "Billing Issue", status: "Closed", lastUpdated: "2025-07-05" },
    { id: "C-004", subject: "Technical Support", status: "Open", lastUpdated: "2025-07-12" },
  ]

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Open":
        return "default"
      case "Pending":
        return "secondary"
      case "Closed":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t("case_followup")}</CardTitle>
        <CardDescription>Track the status of your submitted cases.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("case_id")}</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("last_updated")}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell className="font-medium">{caseItem.id}</TableCell>
                <TableCell>{caseItem.subject}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(caseItem.status)}>{caseItem.status}</Badge>
                </TableCell>
                <TableCell>{caseItem.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    {t("view_details")}
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
