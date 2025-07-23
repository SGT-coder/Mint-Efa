"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n"

export default function OfficeLocatorContent() {
  const { t } = useTranslation("en")

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">{t("office_locator_title")}</CardTitle>
        <CardDescription className="text-gray-600">{t("office_locator_description")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-start space-x-4">
          <MapPin className="h-6 w-6 text-green-700 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{t("main_office")}</h3>
            <p className="text-gray-700">123 CRM Avenue, Suite 400</p>
            <p className="text-gray-700">Addis Ababa, Ethiopia</p>
            <p className="text-gray-700">Phone: +251 11 234 5678</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h4 className="font-semibold text-gray-800">{t("building_name")}: MInT Tower</h4>
            <p className="text-gray-700">{t("floor_number")}: 5th Floor</p>
            <p className="text-gray-700">{t("seat_location")}: A-101</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold text-gray-800">{t("building_name")}: Innovation Hub</h4>
            <p className="text-gray-700">{t("floor_number")}: Ground Floor</p>
            <p className="text-gray-700">{t("seat_location")}: B-205</p>
          </Card>
        </div>
        <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          {/* Placeholder for 3D animated office image */}
          {/* In a real application, you would use a library like @react-three/fiber or <model-viewer> here */}
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="3D Office Model Placeholder"
            width={600}
            height={400}
            className="object-cover w-full h-full"
          />
          <p className="absolute text-gray-600 text-lg font-medium">3D Office Model Placeholder</p>
        </div>
      </CardContent>
    </Card>
  )
}
