"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useLocale } from "@/components/locale-provider"
import { RideHeader } from "@/components/ride-header"
import { RideMap } from "@/components/ride-map"
import { RideDetails } from "@/components/ride-details"
import { RideActions } from "@/components/ride-actions"
import { RideOtpVerification } from "@/components/ride-otp-verification"
import { mockRides } from "@/lib/mock-data"
import type { RideStatus } from "@/lib/types"

export default function RidePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { t } = useLocale()
  const [ride, setRide] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showOtpVerification, setShowOtpVerification] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem("vaya_auth_token")
    if (!authToken) {
      router.push("/auth/login")
      return
    }

    // Find ride by ID
    const rideId = params.id as string
    const foundRide = mockRides.find((r) => r.id === rideId)

    if (!foundRide) {
      toast({
        title: t("error"),
        description: t("rideNotFound"),
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setRide(foundRide)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id, router, toast, t])

  const updateRideStatus = (newStatus: RideStatus) => {
    if (newStatus === "inProgress") {
      setShowOtpVerification(true)
      return
    }

    setRide((prev) => ({
      ...prev,
      status: newStatus,
    }))

    if (newStatus === "completed") {
      toast({
        title: t("rideCompleted"),
        description: t("rideCompletedDescription"),
      })

      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } else if (newStatus === "accepted") {
      toast({
        title: t("statusUpdated"),
        description: t(`statusAccepted`),
      })

      // Redirect to navigate to pickup after 5 seconds
      setTimeout(() => {
        updateRideStatus("arrived")
      }, 5000)
    } else {
      toast({
        title: t("statusUpdated"),
        description: t(`status${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`),
      })
    }
  }

  const handleOtpVerified = () => {
    setShowOtpVerification(false)

    // Update ride status after OTP verification
    setRide((prev) => ({
      ...prev,
      status: "inProgress",
    }))

    // Redirect to in-ride page after 5 seconds
    setTimeout(() => {
      toast({
        title: t("statusUpdated"),
        description: t("statusInProgress"),
      })
    }, 5000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <RideHeader ride={ride} />

      <div className="p-4 space-y-4">
        <RideMap ride={ride} />

        {showOtpVerification ? (
          <RideOtpVerification onVerified={handleOtpVerified} />
        ) : (
          <>
            <RideDetails ride={ride} />
            <RideActions ride={ride} onUpdateStatus={updateRideStatus} />
          </>
        )}
      </div>
    </div>
  )
}
