"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function DownloadsContent() {
  const { t } = useTranslation("en")

  const downloads = [
    { name: t("download_guide"), file: "/downloads/user-guide.pdf" },
    { name: t("download_brochure"), file: "/downloads/product-brochure.pdf" },
    { name: t("download_policy"), file: "/downloads/privacy-policy.pdf" },
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">{t("downloads_title")}</CardTitle>
        <CardDescription className="text-gray-600">{t("downloads_description")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {downloads.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
            <span className="text-lg font-medium text-gray-800">{item.name}</span>
            <Button asChild variant="outline" className="text-green-700 hover:text-green-800 bg-transparent">
              <a href={item.file} download>
                <Download className="mr-2 h-4 w-4" /> {t("download")}
              </a>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
