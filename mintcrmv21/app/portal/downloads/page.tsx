"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function PublicDownloadsPage() {
  const { t } = useTranslation("en")

  const downloadables = [
    {
      name: t("download_guide"),
      description: "A comprehensive guide to using MInT CRM.",
      file: "/downloads/mint-crm-user-guide.pdf",
    },
    {
      name: t("download_brochure"),
      description: "Learn more about MInT CRM's features and benefits.",
      file: "/downloads/mint-crm-product-brochure.pdf",
    },
    {
      name: t("download_software"),
      description: "Download the latest desktop client for MInT CRM.",
      file: "/downloads/mint-crm-setup.exe",
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">{t("download_resources")}</CardTitle>
          <CardDescription className="mt-2 text-gray-600">{t("download_description")}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {downloadables.map((item, index) => (
            <Card key={index} className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
              <Button
                asChild
                className="mt-4 self-end bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600"
              >
                <a href={item.file} download>
                  <Download className="mr-2 h-4 w-4" /> {t("download")}
                </a>
              </Button>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
