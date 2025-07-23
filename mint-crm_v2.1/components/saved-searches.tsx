"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"

export default function SavedSearches() {
  const { t } = useTranslation("en")

  const searches = [
    { name: "Open Cases - High Priority", criteria: "Status: Open, Priority: High", createdAt: "2025-06-20" },
    { name: "Contacts in Addis Ababa", criteria: "Location: Addis Ababa", createdAt: "2025-06-15" },
    { name: "Tasks Due This Week", criteria: "Due Date: This Week", createdAt: "2025-07-01" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t("saved_searches")}</CardTitle>
        <CardDescription>Manage your frequently used searches.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("search_name")}</TableHead>
              <TableHead>{t("criteria")}</TableHead>
              <TableHead>{t("created_at")}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searches.map((search, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{search.name}</TableCell>
                <TableCell>{search.criteria}</TableCell>
                <TableCell>{search.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Run Search
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
