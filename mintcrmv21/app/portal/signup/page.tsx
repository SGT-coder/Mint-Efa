"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/lib/i18n"
import { useRouter } from "next/navigation"

export default function PortalSignupPage() {
  const { t } = useTranslation("en")
  const router = useRouter()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate signup
    console.log("Customer signup attempt...")
    router.push("/portal/profile") // Redirect to profile after signup
  }

  return (
    <div className="flex min-h-[calc(100vh-180px)] items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t("customer_signup")}</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create a new customer portal account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name_label")}</Label>
              <Input id="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email_label")}</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password_label")}</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t("confirm_password_label")}</Label>
              <Input id="confirm-password" type="password" required />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <input type="checkbox" id="terms" required className="rounded" />
              <label htmlFor="terms">
                I agree to the{" "}
                <Link href="/portal/terms" className="underline hover:text-green-700">
                  {t("terms_of_service")}
                </Link>{" "}
                and{" "}
                <Link href="/portal/privacy" className="underline hover:text-green-700">
                  {t("privacy_policy")}
                </Link>
                .
              </label>
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              {t("signup_button")}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {t("already_have_account")}{" "}
            <Link href="/login" className="underline">
              {t("login_link")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
