"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"

export default function ProfileDetails() {
  const { t } = useTranslation("en")

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Profile update initiated.")
    // Add logic to update user profile
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t("profile_details")}</CardTitle>
        <CardDescription>Manage your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name_label")}</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email_label")}</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone_label")}</Label>
            <Input id="phone" defaultValue="+251 911 123 456" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t("address_label")}</Label>
            <Input id="address" defaultValue="123 Main St, Addis Ababa" />
          </div>
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
            {t("update_profile")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
