"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { t, changeLanguage } = useTranslation("en")

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/portal" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-green-800 font-bold text-sm">M</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">MInT CRM Customer Portal</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>CP</AvatarFallback>
                </Avatar>
                <span className="hidden md:block">Customer User</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/portal/profile">{t("profile_title")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Select onValueChange={changeLanguage} defaultValue="en">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("language_select")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
              <SelectItem value="om">Afaan Oromoo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
      <footer className="bg-gray-100 border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} MInT CRM. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link href="/portal/terms" className="hover:underline">
            {t("terms_of_service")}
          </Link>
          <Link href="/portal/privacy" className="hover:underline">
            {t("privacy_policy")}
          </Link>
        </div>
      </footer>
    </div>
  )
}
