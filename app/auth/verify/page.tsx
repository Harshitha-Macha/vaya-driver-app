"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"
import { useFontSize } from "@/lib/font-size-provider"
import OtpInput from "@/components/otp-input"
import { AppLogo } from "@/components/app-logo"

export default function VerifyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLocale()
  const { fontSizeClass } = useFontSize()
  const [otp, setOtp] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    // Get phone number from localStorage
    const storedPhone = localStorage.getItem("vaya_phone")
    if (!storedPhone) {
      router.push("/auth/login")
      return
    }
    setPhoneNumber(storedPhone)

    // Countdown for resend OTP
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  // const handleVerify = () => {
  //   if (otp.length !== 4) {
  //     toast({
  //       title: t("error"),
  //       description: t("invalidOtp"),
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   setIsLoading(true)

  //   // Simulate API call - mock OTP validation (accept any 4-digit code)
  //   setTimeout(() => {
  //     // Set auth token
  //     localStorage.setItem("vaya_auth_token", "mock-token-" + Date.now())

  //     toast({
  //       title: t("success"),
  //       description: t("loginSuccess"),
  //     })

  //     // Redirect to dashboard
  //     router.push("/dashboard")

  //     setIsLoading(false)
  //   }, 1500)
  // }


  const handleVerify = async () => {
  if (otp.length !== 4) {
    toast({ title: t("error"), description: t("invalidOtp"), variant: "destructive" })
    return
  }

  setIsLoading(true)

  try {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber, otp }),
    })

    if (!res.ok) throw new Error()

    const data = await res.json()
    localStorage.setItem("vaya_auth_token", data.token)

    toast({ title: t("success"), description: t("loginSuccess") })
    router.push("/dashboard")
  } catch {
    toast({ title: t("error"), description: "Invalid OTP", variant: "destructive" })
  } finally {
    setIsLoading(false)
  }
}

  const handleResend = () => {
    if (countdown > 0) return

    toast({
      title: t("otpResent"),
      description: t("checkPhone"),
    })

    setCountdown(30)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <AppLogo />
          </div>
          <CardTitle className={`text-2xl font-bold text-center ${fontSizeClass}`}>{t("verifyTitle")}</CardTitle>
          <CardDescription className="text-center">
            {t("verifyDescription")} {phoneNumber}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <OtpInput value={otp} onChange={setOtp} />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {countdown > 0 ? (
                <>
                  {t("resendIn")} {countdown}s
                </>
              ) : (
                <button onClick={handleResend} className="text-black underline">
                  {t("resendOtp")}
                </button>
              )}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleVerify}
            className="w-full bg-black hover:bg-gray-800 text-white"
            disabled={isLoading || otp.length !== 4}
          >
            {isLoading ? (
              <>
                <span className="mr-2">{t("verifying")}</span>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </>
            ) : (
              t("verifyButton")
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
