"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"
import { useFontSize } from "@/lib/font-size-provider"
import { DashboardHeader } from "@/components/dashboard-header"
import { RideCard } from "@/components/ride-card"
import { NoRides } from "@/components/no-rides"
import { mockRides } from "@/lib/mock-data"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLocale()
  const { fontSizeClass } = useFontSize()
  const [isOnline, setIsOnline] = useState(false)
  const [rides, setRides] = useState(mockRides)
  const [isLoading, setIsLoading] = useState(true)

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

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline)
    toast({
      title: !isOnline ? t("youreOnline") : t("youreOffline"),
      description: !isOnline ? t("receivingRides") : t("notReceivingRides"),
    })
  }

  const handleAcceptRide = (rideId: string) => {
    router.push(`/rides/${rideId}`)
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
      <DashboardHeader isOnline={isOnline} />

      <div className="p-4">
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`font-medium ${fontSizeClass}`}>{isOnline ? t("youreOnline") : t("youreOffline")}</h3>
                <p className={`text-gray-500 ${fontSizeClass === "text-lg" ? "text-base" : "text-sm"}`}>
                  {isOnline ? t("receivingRides") : t("notReceivingRides")}
                </p>
              </div>
              <Button
                onClick={toggleOnlineStatus}
                className={isOnline ? "bg-black text-white" : "bg-gray-200 text-black"}
              >
                {isOnline ? t("goOffline") : t("goOnline")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-2">
          <h2
            className={`font-bold ${fontSizeClass === "text-sm" ? "text-lg" : fontSizeClass === "text-lg" ? "text-2xl" : "text-xl"}`}
          >
            {t("availableRides")}
          </h2>
        </div>

        {isOnline ? (
          rides.length > 0 ? (
            <div className="space-y-4">
              {rides.map((ride) => (
                <RideCard key={ride.id} ride={ride} onAccept={() => handleAcceptRide(ride.id)} />
              ))}
            </div>
          ) : (
            <NoRides />
          )
        ) : (
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <p className={fontSizeClass}>{t("goOnlineToSeeRides")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
