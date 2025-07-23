"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MapPin, Building, LayoutGrid, Square } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function OfficeLocatorPage() {
  const [buildingName, setBuildingName] = useState("")
  const [floorNumber, setFloorNumber] = useState("")
  const [seatLocation, setSeatLocation] = useState("")
  const [foundLocation, setFoundLocation] = useState<{ building: string; floor: string; seat: string } | null>(null)
  const { t } = useTranslation("en")

  const handleSearch = () => {
    // Simulate searching for a location
    if (buildingName && floorNumber && seatLocation) {
      setFoundLocation({
        building: buildingName,
        floor: floorNumber,
        seat: seatLocation,
      })
    } else {
      setFoundLocation(null)
      alert("Please enter all location details to search.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">{t("find_our_office")}</CardTitle>
          <CardDescription className="mt-2 text-gray-600">{t("office_location_details")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buildingName">{t("building_name")}</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="buildingName"
                  type="text"
                  placeholder="Main Building"
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="floorNumber">{t("floor_number")}</Label>
              <div className="relative">
                <LayoutGrid className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="floorNumber"
                  type="text"
                  placeholder="3rd Floor"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seatLocation">{t("seat_location")}</Label>
              <div className="relative">
                <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="seatLocation"
                  type="text"
                  placeholder="A-123"
                  value={seatLocation}
                  onChange={(e) => setSeatLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600"
          >
            <MapPin className="mr-2 h-4 w-4" /> {t("search_location")}
          </Button>

          {foundLocation && (
            <div className="mt-8 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("location_found")}</h3>
              <p className="text-gray-700">
                <strong>{t("building")}:</strong> {foundLocation.building}
              </p>
              <p className="text-gray-700">
                <strong>{t("floor")}:</strong> {foundLocation.floor}
              </p>
              <p className="text-gray-700">
                <strong>{t("seat")}:</strong> {foundLocation.seat}
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t("view_3d_model")}</h3>
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              {/* Placeholder for 3D model */}
              <p>
                3D Office Model Placeholder (e.g., using &lt;model-viewer&gt; or @react-three/fiber)
                <br />
                <a href="/office-model.glb" download className="text-green-600 hover:underline">
                  Download office-model.glb
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
