"use client"

import type React from "react"

import { useState } from "react"
import { Bell, ChevronDown, Menu, Search, Settings, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  FileText,
  Mail,
  Calendar,
  Users,
  BarChart3,
  User,
  Workflow,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const Navigation = ({ isMobile = false, onClose = () => {}, isCollapsed = false, onToggle = () => {} }) => {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", count: null },
    { name: "Cases", icon: FileText, href: "/cases", count: 24 },
    { name: "Tasks", icon: CheckSquare, href: "/tasks", count: 18 },
    { name: "Contacts", icon: Users, href: "/contacts", count: 156 },
    { name: "Meetings", icon: Calendar, href: "/meetings", count: 5 },
    { name: "Documents", icon: FolderOpen, href: "/documents", count: 89 },
    { name: "Emails", icon: Mail, href: "/emails", count: 7 },
    { name: "Reports", icon: BarChart3, href: "/reports", count: null },
    { name: "Users", icon: User, href: "/users", count: null },
    { name: "Workflows", icon: Workflow, href: "/workflow", count: null }, // New Workflow link
  ]

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <nav
      className={`${
        isMobile ? "w-full" : isCollapsed ? "w-20" : "w-72"
      } bg-gray-100 text-gray-800 transition-all duration-300 ease-in-out shadow-xl border-r border-gray-200`}
    >
      <div className="p-4 space-y-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-green-800 font-bold text-sm">M</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">MInT CRM</h1>
                <p className="text-xs text-gray-600">Customer Relations</p>
              </div>
            </Link>
          )}
          {isMobile ? (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-600 hover:bg-gray-200 ml-auto">
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-gray-600 hover:bg-gray-200 p-2 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} onClick={isMobile ? onClose : undefined}>
                <div
                  className={`group relative flex items-center rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive ? "bg-gray-200 text-gray-900" : "hover:bg-gray-200 text-gray-700 hover:text-gray-900"
                  } ${isCollapsed ? "justify-center p-3" : "p-3"}`}
                >
                  <div className="flex items-center w-full">
                    <div className={`flex items-center justify-center ${isCollapsed ? "" : "mr-3"}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>

                    {!isCollapsed && (
                      <>
                        <span className="font-medium text-sm flex-1">{item.name}</span>
                        {item.count && (
                          <Badge
                            variant="secondary"
                            className={`text-xs font-semibold min-w-[24px] h-6 ${
                              isActive
                                ? "bg-yellow-500 text-green-800 border-yellow-400"
                                : "bg-yellow-500 text-green-800 border-yellow-400"
                            }`}
                          >
                            {item.count}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>

                  {/* Count badge for collapsed state */}
                  {isCollapsed && item.count && (
                    <div className="absolute -top-1 -right-1">
                      <Badge
                        variant="secondary"
                        className="text-xs font-bold min-w-[20px] h-5 bg-yellow-500 text-green-800 border-yellow-400 rounded-full"
                      >
                        {item.count}
                      </Badge>
                    </div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg border border-gray-700">
                      <div className="font-medium">{item.name}</div>
                      {item.count && <div className="text-xs text-gray-300">{item.count} items</div>}
                      {/* Arrow */}
                      <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 border-l border-b border-gray-700 rotate-45"></div>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Settings Section */}
        <div className="pt-6 mt-6 border-t border-gray-200">
          <Link href="/settings">
            <div
              className={`group relative flex items-center rounded-xl hover:bg-gray-200 cursor-pointer transition-all duration-200 text-gray-700 hover:text-gray-900 ${
                pathname === "/settings" ? "bg-gray-200 text-gray-900" : ""
              } ${isCollapsed ? "justify-center p-3" : "p-3"}`}
            >
              <div className="flex items-center w-full">
                <div className={`flex items-center justify-center ${isCollapsed ? "" : "mr-3"}`}>
                  <Settings className="h-5 w-5" />
                </div>
                {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
              </div>

              {/* Tooltip for collapsed state */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg border border-gray-700">
                  <div className="font-medium">Settings</div>
                  {/* Arrow */}
                  <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 border-l border-b border-gray-700 rotate-45"></div>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="pt-6 mt-6 border-t border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-200 cursor-pointer transition-colors">
                  <Avatar className="h-8 w-8 border-2 border-yellow-400">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-yellow-500 text-green-800 text-sm font-bold">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                    <p className="text-xs text-gray-600 truncate">Administrator</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Navigation isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Navigation isMobile onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <Navigation isMobile />
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search cases, contacts..." className="pl-10 w-64" />
              </div>

              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block">John Doe</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
