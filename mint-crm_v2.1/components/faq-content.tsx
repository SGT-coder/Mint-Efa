"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"

export default function FaqContent() {
  const { t } = useTranslation("en")

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">{t("faq_title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold text-gray-800">{t("faq_q1")}</AccordionTrigger>
            <AccordionContent className="text-gray-700">{t("faq_a1")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold text-gray-800">{t("faq_q2")}</AccordionTrigger>
            <AccordionContent className="text-gray-700">{t("faq_a2")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold text-gray-800">{t("faq_q3")}</AccordionTrigger>
            <AccordionContent className="text-gray-700">{t("faq_a3")}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
