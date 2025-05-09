"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { useFontSize } from "@/lib/font-size-provider"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IndianRupee, Car, TrendingUp } from "lucide-react"

// Mock earnings data
const earningsData = {
  today: {
    totalEarnings: "₹1,250",
    totalRides: 5,
    averageFare: "₹250",
  },
  week: {
    totalEarnings: "₹8,450",
    totalRides: 32,
    averageFare: "₹264",
  },
  month: {
    totalEarnings: "₹32,800",
    totalRides: 124,
    averageFare: "₹265",
  },
}

export default function EarningsPage() {
  const router = useRouter()
  const { t } = useLocale()
  const { fontSizeClass } = useFontSize()
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHeader title={t("myEarnings")} />

      <div className="p-4">
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">{t("today")}</TabsTrigger>
            <TabsTrigger value="week">{t("thisWeek")}</TabsTrigger>
            <TabsTrigger value="month">{t("thisMonth")}</TabsTrigger>
          </TabsList>

          {Object.entries(earningsData).map(([period, data]) => (
            <TabsContent key={period} value={period} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-2">
                      <IndianRupee className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm text-gray-500">{t("totalEarnings")}</h3>
                    <p
                      className={`font-bold ${fontSizeClass === "text-sm" ? "text-xl" : fontSizeClass === "text-lg" ? "text-3xl" : "text-2xl"}`}
                    >
                      {data.totalEarnings}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-2">
                      <Car className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm text-gray-500">{t("totalRides")}</h3>
                    <p
                      className={`font-bold ${fontSizeClass === "text-sm" ? "text-xl" : fontSizeClass === "text-lg" ? "text-3xl" : "text-2xl"}`}
                    >
                      {data.totalRides}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-2">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm text-gray-500">{t("averageFare")}</h3>
                    <p
                      className={`font-bold ${fontSizeClass === "text-sm" ? "text-xl" : fontSizeClass === "text-lg" ? "text-3xl" : "text-2xl"}`}
                    >
                      {data.averageFare}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Earnings chart would go here */}
              <Card>
                <CardContent className="p-6 h-64 flex items-center justify-center">
                  <p className="text-gray-500">Earnings chart visualization would appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
