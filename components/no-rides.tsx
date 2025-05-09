"use client"

import { Car } from "lucide-react"
import { useLocale } from "@/components/locale-provider"

export function NoRides() {
  const { t } = useLocale()

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
      <Car className="h-12 w-12 mb-4 text-gray-400" />
      <h3 className="text-lg font-medium">{t("noRidesAvailable")}</h3>
      <p className="text-sm text-gray-500 text-center mt-2">{t("noRidesDescription")}</p>
    </div>
  )
}
