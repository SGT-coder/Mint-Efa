"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"

export default function PrivacyPolicyPage() {
  const { t } = useTranslation("en")
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900">{t("privacy_policy")}</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 space-y-4 text-left">
          <p>
            Your privacy is important to us. This Privacy Policy explains how MInT CRM collects, uses, and protects your
            personal information when you use our Customer Portal.
          </p>
          <h3 className="text-xl font-semibold mt-6">1. Information We Collect</h3>
          <p>
            We collect information you provide directly to us, such as when you create an account, submit a request, or
            communicate with us. This may include your name, email address, phone number, and any other information you
            choose to provide.
          </p>
          <h3 className="text-xl font-semibold mt-6">2. How We Use Your Information</h3>
          <p>
            We use the information we collect to:
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process your requests and inquiries.</li>
              <li>Communicate with you, including sending you updates and notifications.</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
            </ul>
          </p>
          <h3 className="text-xl font-semibold mt-6">3. Sharing of Information</h3>
          <p>
            We may share your information with third parties only in the following circumstances:
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>With your consent.</li>
              <li>With service providers who perform services on our behalf (e.g., hosting, analytics).</li>
              <li>To comply with legal obligations or respond to lawful requests.</li>
              <li>
                To protect our rights, property, or safety, and the rights, property, or safety of our users or others.
              </li>
            </ul>
          </p>
          <h3 className="text-xl font-semibold mt-6">4. Data Security</h3>
          <p>
            We implement reasonable security measures to protect your personal information from unauthorized access,
            alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic
            storage is 100% secure.
          </p>
          <h3 className="text-xl font-semibold mt-6">5. Your Choices</h3>
          <p>
            You may review, update, or delete your account information by logging into your account settings. You may
            also opt out of receiving promotional communications from us by following the instructions in those
            communications.
          </p>
          <h3 className="text-xl font-semibold mt-6">6. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          <h3 className="text-xl font-semibold mt-6">7. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@mintcrm.com.</p>
        </CardContent>
      </Card>
    </div>
  )
}
