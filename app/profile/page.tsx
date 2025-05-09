"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useLocale } from "@/components/locale-provider"
import { useFontSize } from "@/lib/font-size-provider"
import { PageHeader } from "@/components/page-header"
import { User } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLocale()
  const { fontSizeClass } = useFontSize()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "",
  })

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem("vaya_auth_token")
    if (!authToken) {
      router.push("/auth/login")
      return
    }

    // Get phone number from localStorage
    const phone = localStorage.getItem("vaya_phone") || "+91 98765 12345"
    setFormData((prev) => ({ ...prev, phone }))

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: t("success"),
      description: t("profileUpdated"),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHeader title={t("profile")} />

      <div className="p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
            <User className="h-12 w-12 text-gray-500" />
          </div>
          <h2
            className={`font-bold ${fontSizeClass === "text-sm" ? "text-lg" : fontSizeClass === "text-lg" ? "text-2xl" : "text-xl"}`}
          >
            {formData.name}
          </h2>
          <p className="text-gray-500">{formData.phone}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className={fontSizeClass}>{t("personalInformation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={fontSizeClass}>
                  {t("fullName")}
                </Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} className={fontSizeClass} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={fontSizeClass}>
                  {t("email")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={fontSizeClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className={fontSizeClass}>
                  {t("phoneNumber")}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled
                  className={fontSizeClass}
                />
              </div>

              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
                {t("saveChanges")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
