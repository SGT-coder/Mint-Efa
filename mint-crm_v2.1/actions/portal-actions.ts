"use server"

import { revalidatePath } from "next/cache"

export async function submitPortalRequest(formData: FormData) {
  const requestType = formData.get("requestType") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  // Send to backend API
  try {
    const res = await fetch("/api/portal/submit-request/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestType, subject, message }),
    })
    if (!res.ok) {
      const error = await res.json()
      return { success: false, message: error.message || "Failed to submit request." }
    }
    const data = await res.json()
    return { success: true, message: data.message || "Your request has been submitted successfully!" }
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to submit request." }
  }
}
