"use server"

import { revalidatePath } from "next/cache"

export async function submitPortalRequest(formData: FormData) {
  const requestType = formData.get("requestType") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  // Simulate a delay for network request
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real application, you would save this data to a database
  // and potentially send an email notification to the CRM team.
  console.log("New Portal Request Submitted:")
  console.log(`Type: ${requestType}`)
  console.log(`Subject: ${subject}`)
  console.log(`Message: ${message}`)

  // Revalidate the path if necessary, e.g., if requests were displayed on the dashboard
  revalidatePath("/portal")

  return { success: true, message: "Your request has been submitted successfully!" }
}
