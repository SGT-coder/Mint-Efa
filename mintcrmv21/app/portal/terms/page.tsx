"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"

export default function TermsOfServicePage() {
  const { t } = useTranslation("en")
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900">{t("terms_of_service")}</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 space-y-4 text-left">
          <p>
            Welcome to MInT CRM Customer Portal. These Terms of Service govern your use of our services. By accessing or
            using our services, you agree to be bound by these terms.
          </p>
          <h3 className="text-xl font-semibold mt-6">1. Acceptance of Terms</h3>
          <p>
            By using the MInT CRM Customer Portal, you signify your agreement to these Terms of Service. If you do not
            agree to these terms, you may not use our services.
          </p>
          <h3 className="text-xl font-semibold mt-6">2. Changes to Terms</h3>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new
            Terms on this page. Your continued use of the service after any such changes constitutes your acceptance of
            the new Terms of Service.
          </p>
          <h3 className="text-xl font-semibold mt-6">3. User Conduct</h3>
          <p>
            You agree to use the portal only for lawful purposes and in a way that does not infringe the rights of,
            restrict or inhibit anyone else's use and enjoyment of the portal. Prohibited behavior includes harassing or
            causing distress or inconvenience to any other user, transmitting obscene or offensive content or disrupting
            the normal flow of dialogue within the portal.
          </p>
          <h3 className="text-xl font-semibold mt-6">4. Intellectual Property</h3>
          <p>
            All content on this portal, including text, graphics, logos, images, and software, is the property of MInT
            CRM or its content suppliers and protected by international copyright laws.
          </p>
          <h3 className="text-xl font-semibold mt-6">5. Disclaimer of Warranties</h3>
          <p>
            The service is provided on an "as is" and "as available" basis. MInT CRM makes no warranties, expressed or
            implied, and hereby disclaims and negates all other warranties, including without limitation, implied
            warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
          <h3 className="text-xl font-semibold mt-6">6. Limitation of Liability</h3>
          <p>
            In no event shall MInT CRM or its suppliers be liable for any damages (including, without limitation,
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability to
            use the materials on MInT CRM's website, even if MInT CRM or a MInT CRM authorized representative has been
            notified orally or in writing of the possibility of such damage.
          </p>
          <h3 className="text-xl font-semibold mt-6">7. Governing Law</h3>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Ethiopia and you
            irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
