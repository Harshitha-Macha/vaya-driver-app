"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { PhoneIcon } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLocale()
  const [phoneNumber, setPhoneNumber] = useState("+91 ")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: t("error"),
        description: t("invalidPhoneNumber"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Store phone number for OTP verification
      localStorage.setItem("vaya_phone", phoneNumber)

      // Redirect to OTP verification
      router.push("/auth/verify")

      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t("loginTitle")}</CardTitle>
          <CardDescription className="text-center">{t("loginDescription")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-black">
                <div className="px-3 py-2 border-r">
                  <PhoneIcon className="h-5 w-5" />
                </div>
                <Input
                  type="tel"
                  placeholder={t("phoneNumberPlaceholder")}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border-0 focus-visible:ring-0"
                />
              </div>
            </div>
            <LanguageSwitcher />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2">{t("sending")}</span>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </>
              ) : (
                t("continueButton")
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
