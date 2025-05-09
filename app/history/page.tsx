"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { useFontSize } from "@/lib/font-size-provider"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Calendar } from "lucide-react"

// Mock completed rides data
const completedRides = [
  {
    id: "ride-101",
    passengerName: "Priya Patel",
    date: "2023-05-15",
    fare: "₹320",
    distance: "7.8 km",
    pickup: "Indiranagar 100ft Road, Bengaluru",
    dropoff: "HSR Layout Sector 2, Bengaluru",
  },
  {
    id: "ride-102",
    passengerName: "Amit Kumar",
    date: "2023-05-14",
    fare: "₹450",
    distance: "18.5 km",
    pickup: "Whitefield, Bengaluru",
    dropoff: "Electronic City Phase 1, Bengaluru",
  },
  {
    id: "ride-103",
    passengerName: "Rahul Sharma",
    date: "2023-05-13",
    fare: "₹250",
    distance: "5.2 km",
    pickup: "MG Road, Bengaluru",
    dropoff: "Koramangala 5th Block, Bengaluru",
  },
  {
    id: "ride-104",
    passengerName: "Sneha Reddy",
    date: "2023-05-12",
    fare: "₹180",
    distance: "3.5 km",
    pickup: "JP Nagar 6th Phase, Bengaluru",
    dropoff: "Jayanagar 4th Block, Bengaluru",
  },
  {
    id: "ride-105",
    passengerName: "Vikram Singh",
    date: "2023-05-10",
    fare: "₹550",
    distance: "22.3 km",
    pickup: "Hebbal, Bengaluru",
    dropoff: "Kempegowda International Airport, Bengaluru",
  },
]

export default function HistoryPage() {
  const router = useRouter()
  const { t } = useLocale()
  const { fontSizeClass } = useFontSize()
  const [isLoading, setIsLoading] = useState(true)
  const [rides, setRides] = useState<any[]>([])

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem("vaya_auth_token")
    if (!authToken) {
      router.push("/auth/login")
      return
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setRides(completedRides)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen">
      <PageHeader title={t("rideHistory")} />

      <div className="p-4">
        {rides.length > 0 ? (
          <div className="space-y-4">
            {rides.map((ride) => (
              <Card key={ride.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-medium ${fontSizeClass}`}>{ride.passengerName}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(ride.date)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{ride.fare}</div>
                      <div className="text-sm text-gray-500">{ride.distance}</div>
                    </div>
                  </div>
                  <div className="space-y-1 mt-3 text-sm text-gray-500">
                    <div className="flex items-start">
                      <div className="mr-2 mt-1">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                      </div>
                      <div className="flex-1">
                        <p>{ride.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-2 mt-1">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                      </div>
                      <div className="flex-1">
                        <p>{ride.dropoff}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
            <Car className="h-12 w-12 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">{t("noRideHistory")}</h3>
            <p className="text-sm text-gray-500 text-center mt-2">{t("noRideHistoryDescription")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
