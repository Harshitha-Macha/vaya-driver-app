"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"
import OtpInput from "@/components/otp-input"
import { DEFAULT_RIDE_OTP } from "@/lib/mock-data"

interface RideOtpVerificationProps {
  onVerified: () => void
}

export function RideOtpVerification({ onVerified }: RideOtpVerificationProps) {
  const { toast } = useToast()
  const { t } = useLocale()
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast({
        title: t("error"),
        description: t("invalidRideOtp"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call - verify OTP
    setTimeout(() => {
      if (otp === DEFAULT_RIDE_OTP) {
        toast({
          title: t("otpVerified"),
          description: t("startingRide"),
        })
        onVerified()
      } else {
        toast({
          title: t("error"),
          description: t("invalidRideOtp"),
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }, 1500)
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">{t("enterRideOtp")}</CardTitle>
        <CardDescription>{t("enterRideOtpDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <OtpInput value={otp} onChange={setOtp} length={6} />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleVerify}
          className="w-full bg-black hover:bg-gray-800 text-white"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? (
            <>
              <span className="mr-2">{t("verifying")}</span>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </>
          ) : (
            t("verifyOtp")
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
