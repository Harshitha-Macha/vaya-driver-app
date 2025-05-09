"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { MainNav } from "@/components/main-nav"

interface DashboardHeaderProps {
  isOnline?: boolean
  title?: string
}

export function DashboardHeader({ isOnline, title = "Vaya Driver" }: DashboardHeaderProps) {
  const router = useRouter()
  const { t } = useLocale()

  return (
    <header className="sticky top-0 z-10 bg-white border-b p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <MainNav isOnline={isOnline} />
          <h1 className="text-xl font-bold ml-2">{title}</h1>
          {isOnline !== undefined && (
            <div className={`ml-2 h-3 w-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
          )}
        </div>
      </div>
    </header>
  )
}
