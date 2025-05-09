"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"
import { User, Phone, Clock, DollarSign } from "lucide-react"

interface RideDetailsProps {
  ride: any
}

export function RideDetails({ ride }: RideDetailsProps) {
  const { t } = useLocale()

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-500" />
              <div>
                <p className="font-medium">{ride.passengerName}</p>
                <p className="text-sm text-gray-500">{t("passenger")}</p>
              </div>
            </div>
            <button className="flex items-center text-black">
              <Phone className="h-5 w-5 mr-1" />
              <span>{t("call")}</span>
            </button>
          </div>

          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <p className="font-medium">{ride.estimatedTime} min</p>
              <p className="text-sm text-gray-500">{t("estimatedTime")}</p>
            </div>
          </div>

          <div className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <p className="font-medium">{ride.fare}</p>
              <p className="text-sm text-gray-500">{t("fare")}</p>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="space-y-2">
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

