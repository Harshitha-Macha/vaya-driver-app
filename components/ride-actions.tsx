"use client"

import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"
import type { RideStatus } from "@/lib/types"

interface RideActionsProps {
  ride: any
  onUpdateStatus: (status: RideStatus) => void
}

export function RideActions({ ride, onUpdateStatus }: RideActionsProps) {
  const { t } = useLocale()

  const getActionButton = () => {
    switch (ride.status) {
      case "accepted":
        return (
          <Button onClick={() => onUpdateStatus("arrived")} className="w-full bg-black hover:bg-gray-800 text-white">
            {t("arrivedAtPickup")}
          </Button>
        )
      case "arrived":
        return (
          <Button onClick={() => onUpdateStatus("inProgress")} className="w-full bg-black hover:bg-gray-800 text-white">
            {t("startRide")}
          </Button>
        )
      case "inProgress":
        return (
          <Button onClick={() => onUpdateStatus("completed")} className="w-full bg-black hover:bg-gray-800 text-white">
            {t("completeRide")}
          </Button>
        )
      case "completed":
        return (
          <Button disabled className="w-full bg-gray-200 text-gray-500">
            {t("rideCompleted")}
          </Button>
        )
      default:
        return null
    }
  }

  return <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">{getActionButton()}</div>
}
