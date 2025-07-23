"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileDetails from "@/components/profile-details"
import CaseFollowup from "@/components/case-followup"
import SavedSearches from "@/components/saved-searches"
import UserFiles from "@/components/user-files"
import { useTranslation } from "@/lib/i18n"

export default function UserProfilePage() {
  const { t } = useTranslation("en")
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-4">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900">{t("profile_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">{t("profile_details")}</TabsTrigger>
              <TabsTrigger value="cases">{t("case_followup")}</TabsTrigger>
              <TabsTrigger value="searches">{t("saved_searches")}</TabsTrigger>
              <TabsTrigger value="files">{t("my_files")}</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
              <ProfileDetails />
            </TabsContent>
            <TabsContent value="cases" className="mt-6">
              <CaseFollowup />
            </TabsContent>
            <TabsContent value="searches" className="mt-6">
              <SavedSearches />
            </TabsContent>
            <TabsContent value="files" className="mt-6">
              <UserFiles />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
