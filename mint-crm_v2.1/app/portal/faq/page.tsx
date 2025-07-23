"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useTranslation } from "@/lib/i18n"

export default function FAQsPage() {
  const { t } = useTranslation("en")

  const faqs = [
    {
      question: t("q1_title"),
      answer: t("q1_answer"),
    },
    {
      question: t("q2_title"),
      answer: t("q2_answer"),
    },
    {
      question: t("q3_title"),
      answer: t("q3_answer"),
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">{t("frequently_asked_questions")}</CardTitle>
          <CardDescription className="mt-2 text-gray-600">{t("portal_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-base">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
