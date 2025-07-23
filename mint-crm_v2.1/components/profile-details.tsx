"use client"

import React, { useState, useEffect } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"

export default function ProfileDetails() {
  const { t } = useTranslation("en")
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+251 911 123 456",
    address: "123 Main St, Addis Ababa",
    notifications_enabled: true,
    avatar: null,
  })
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [activity, setActivity] = useState<any[]>([])
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch activity history on mount
  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch("/api/auth/profile/activity/")
        if (res.ok) {
          const data = await res.json()
          setActivity(data)
        }
      } catch {}
    }
    fetchActivity()
  }, [])

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch("/api/auth/profile/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: profile.name.split(" ")[0],
          last_name: profile.name.split(" ").slice(1).join(" "),
          phone: profile.phone,
          address: profile.address,
          notifications_enabled: profile.notifications_enabled,
        }),
      })
      if (!res.ok) throw new Error("Failed to update profile")
      setSuccess("Profile updated successfully!")
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    if (passwords.new !== passwords.confirm) {
      setError("New passwords do not match.")
      setLoading(false)
      return
    }
    try {
      const res = await fetch("/api/auth/profile/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: passwords.current,
          new_password: passwords.new,
        }),
      })
      if (!res.ok) throw new Error("Failed to change password")
      setSuccess("Password changed successfully!")
      setPasswords({ current: "", new: "", confirm: "" })
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!avatarFile) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const formData = new FormData()
      formData.append("avatar", avatarFile)
      const res = await fetch("/api/auth/profile/", {
        method: "PATCH",
        body: formData,
      })
      if (!res.ok) throw new Error("Failed to update avatar")
      setSuccess("Avatar updated successfully!")
      setAvatarFile(null)
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
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
              <Input id="name" value={profile.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email_label")}</Label>
              <Input id="email" type="email" value={profile.email} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone_label")}</Label>
            <Input id="phone" value={profile.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t("address_label")}</Label>
            <Input id="address" value={profile.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, address: e.target.value })} />
          </div>
          <div className="space-y-2 flex items-center">
            <Label htmlFor="notifications">Notifications</Label>
            <input
              id="notifications"
              type="checkbox"
              checked={profile.notifications_enabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, notifications_enabled: e.target.checked })}
              className="ml-2"
            />
            <span className="text-sm text-muted-foreground ml-2">Enable notifications</span>
          </div>
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
            {loading ? "Updating..." : t("update_profile")}
          </Button>
        </form>

        {/* Avatar upload */}
        <form onSubmit={handleAvatarUpload} className="mt-6 space-y-2">
          <Label htmlFor="avatar">Avatar</Label>
          <Input id="avatar" type="file" accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvatarFile(e.target.files?.[0] || null)} />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading || !avatarFile}>
            {loading ? "Uploading..." : "Update Avatar"}
          </Button>
        </form>

        {/* Change password */}
        <form onSubmit={handleChangePassword} className="mt-6 space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input id="current-password" type="password" value={passwords.current} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswords({ ...passwords, current: e.target.value })} />
          <Label htmlFor="new-password">New Password</Label>
          <Input id="new-password" type="password" value={passwords.new} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswords({ ...passwords, new: e.target.value })} />
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input id="confirm-password" type="password" value={passwords.confirm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswords({ ...passwords, confirm: e.target.value })} />
          <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </form>

        {/* Activity history */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Activity History</h3>
          {activity.length === 0 ? (
            <p className="text-muted-foreground">No recent activity.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {activity.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Error/success feedback */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-600 mt-4">{success}</p>}
      </CardContent>
    </Card>
  )
}
