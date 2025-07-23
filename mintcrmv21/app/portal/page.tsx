"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"
import FaqContent from "@/components/faq-content"
import DownloadsContent from "@/components/downloads-content"
import OfficeLocatorContent from "@/components/office-locator-content"
import SubmitRequestForm from "@/components/submit-request-form"

export default function PortalHomePage() {
  const { t } = useTranslation("en")

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] text-center space-y-12 py-12">
      <Card className="w-full max-w-4xl p-8">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-gray-900">{t("portal_welcome")}</CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">{t("portal_description")}</CardDescription>
        </CardHeader>
        <CardContent className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/portal/signup">
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <CardTitle className="text-xl font-semibold text-green-700">{t("customer_signup")}</CardTitle>
                <CardDescription className="mt-2 text-gray-600">Register for a new customer account.</CardDescription>
              </Card>
            </Link>
            <Link href="#faqs-section">
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <CardTitle className="text-xl font-semibold text-green-700">{t("faqs")}</CardTitle>
                <CardDescription className="mt-2 text-gray-600">Find answers to common questions.</CardDescription>
              </Card>
            </Link>
            <Link href="#downloads-section">
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <CardTitle className="text-xl font-semibold text-green-700">{t("public_downloads")}</CardTitle>
                <CardDescription className="mt-2 text-gray-600">Access useful documents and resources.</CardDescription>
              </Card>
            </Link>
            <Link href="#office-locator-section">
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <CardTitle className="text-xl font-semibold text-green-700">{t("office_locator")}</CardTitle>
                <CardDescription className="mt-2 text-gray-600">Locate our offices and find your way.</CardDescription>
              </Card>
            </Link>
          </div>
          <Button
            asChild
            className="mt-8 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white text-lg px-8 py-3"
          >
            <Link href="/portal/signup">{t("get_started")}</Link>
          </Button>
        </CardContent>
      </Card>

      <section id="submit-request-section" className="w-full max-w-4xl">
        <SubmitRequestForm />
      </section>

      <section id="faqs-section" className="w-full max-w-4xl">
        <FaqContent />
      </section>

      <section id="downloads-section" className="w-full max-w-4xl">
        <DownloadsContent />
      </section>

      <section id="office-locator-section" className="w-full max-w-4xl">
        <OfficeLocatorContent />
      </section>
    </div>
  )
}
