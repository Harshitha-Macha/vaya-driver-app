"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"
import { Clock, DollarSign } from "lucide-react"

interface RideCardProps {
  ride: any
  onAccept: () => void
}

export function RideCard({ ride, onAccept }: RideCardProps) {
  const { t } = useLocale()

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium">{ride.passengerName}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{ride.estimatedTime} min</span>
              <span className="mx-2">•</span>
              <span>{ride.distance} km</span>
            </div>
          </div>
          <div className="flex items-center font-medium">
            <DollarSign className="h-4 w-4" />
            <span>{ride.fare}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <div className="mr-2 mt-1">
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">{t("pickup")}</p>
              <p className="text-sm text-gray-500">{ride.pickup}</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-2 mt-1">
              <div className="h-3 w-3 rounded-full bg-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium">{t("dropoff")}</p>
              <p className="text-sm text-gray-500">{ride.dropoff}</p>
            </div>
          </div>
        </div>

        <Button onClick={onAccept} className="w-full bg-black hover:bg-gray-800 text-white">
          {t("acceptRide")}
        </Button>
      </CardContent>
    </Card>
  )
}
