"use client"

import { useActionState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitPortalRequest } from "@/actions/portal-actions"
import { useTranslation } from "@/lib/i18n"
import { toast } from "@/hooks/use-toast"

export default function SubmitRequestForm() {
  const { t } = useTranslation("en")
  const [state, formAction, isPending] = useActionState(submitPortalRequest, null)

  // Show toast notification on state change
  if (state?.success) {
    toast({
      title: "Success!",
      description: state.message,
      variant: "default",
    })
    // Optionally reset the form here if needed
    state.success = false // Prevent re-triggering toast on re-render
  } else if (state?.message && !state.success) {
    toast({
      title: "Error!",
      description: state.message,
      variant: "destructive",
    })
    state.message = "" // Prevent re-triggering toast on re-render
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">{t("submit_request")}</CardTitle>
        <CardDescription className="text-gray-600">
          Please fill out the form below to submit your request, feedback, or inquiry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requestType">{t("request_type")}</Label>
            <Select name="requestType" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="request">Request</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="enquiry">Enquiry</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">{t("request_subject")}</Label>
            <Input id="subject" name="subject" placeholder="Subject of your message" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{t("request_message")}</Label>
            <Textarea id="message" name="message" placeholder="Type your message here." rows={5} required />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isPending}>
            {isPending ? "Submitting..." : t("submit_button")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
