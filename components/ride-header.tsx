"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/components/locale-provider"

interface RideHeaderProps {
  ride: any
}

export function RideHeader({ ride }: RideHeaderProps) {
  const router = useRouter()
  const { t } = useLocale()

  const getStatusBadge = () => {
    switch (ride.status) {
      case "accepted":
        return <Badge variant="outline">{t("accepted")}</Badge>
      case "arrived":
        return <Badge variant="outline">{t("arrived")}</Badge>
      case "inProgress":
        return <Badge variant="outline">{t("inProgress")}</Badge>
      case "completed":
        return <Badge variant="outline">{t("completed")}</Badge>
      default:
        return null
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b p-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="ml-2">
          <h1 className="text-lg font-bold">{t("rideDetails")}</h1>
          {getStatusBadge()}
        </div>
      </div>
    </header>
  )
}
