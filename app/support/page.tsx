"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { useFontSize } from "@/lib/font-size-provider"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

type IssueType = "payment" | "ride" | "app" | "other"

export default function SupportPage() {
  const router = useRouter()
  const { t } = useLocale()
  const { fontSizeClass } = useFontSize()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [issueType, setIssueType] = useState<IssueType>("ride")
  const [description, setDescription] = useState("")

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem("vaya_auth_token")
    if (!authToken) {
      router.push("/auth/login")
      return
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim()) {
      toast({
        title: t("error"),
        description: t("pleaseEnterDescription"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: t("issueSubmitted"),
        description: t("issueSubmittedDescription"),
      })
      setIsSubmitting(false)
      setDescription("")
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHeader title={t("helpAndSupport")} />

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className={fontSizeClass}>{t("submitIssue")}</CardTitle>
            <CardDescription>{t("describeYourIssue")}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className={fontSizeClass}>{t("issueType")}</Label>
                <RadioGroup
                  value={issueType}
                  onValueChange={(value) => setIssueType(value as IssueType)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="payment" id="payment" />
                    <Label htmlFor="payment" className={fontSizeClass}>
                      {t("paymentIssue")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ride" id="ride" />
                    <Label htmlFor="ride" className={fontSizeClass}>
                      {t("rideIssue")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="app" id="app" />
                    <Label htmlFor="app" className={fontSizeClass}>
                      {t("appIssue")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className={fontSizeClass}>
                      {t("otherIssue")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className={fontSizeClass}>
                  {t("issueDescription")}
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className={fontSizeClass}
                  placeholder={t("describeYourIssue")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">{t("submitting")}</span>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </>
                ) : (
                  t("submit")
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
