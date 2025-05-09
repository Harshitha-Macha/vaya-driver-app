"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"
import { useFontSize } from "@/lib/font-size-provider"

export default function CreateProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLocale()
  const { fontSizeClass } = useFontSize()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    aadhaarNumber: "",
    licenseNumber: "",
    vehicleType: "",
    vehicleNumber: "",
  })

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem("vaya_auth_token")
    if (!authToken) {
      router.push("/auth/login")
      return
    }

    // Check if profile is already complete
    const profileComplete = localStorage.getItem("vaya_profile_complete")
    if (profileComplete === "true") {
      router.push("/dashboard")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // For Aadhaar number, only allow digits and limit to 12 characters
    if (name === "aadhaarNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 12)
      setFormData((prev) => ({ ...prev, [name]: numericValue }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleVehicleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, vehicleType: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: t("error"),
        description: t("nameRequired"),
        variant: "destructive",
      })
      return
    }

    if (formData.aadhaarNumber.length !== 12) {
      toast({
        title: t("error"),
        description: t("invalidAadhaar"),
        variant: "destructive",
      })
      return
    }

    if (!formData.licenseNumber.trim()) {
      toast({
        title: t("error"),
        description: t("licenseRequired"),
        variant: "destructive",
      })
      return
    }

    if (!formData.vehicleType) {
      toast({
        title: t("error"),
        description: t("vehicleTypeRequired"),
        variant: "destructive",
      })
      return
    }

    if (!formData.vehicleNumber.trim()) {
      toast({
        title: t("error"),
        description: t("vehicleNumberRequired"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Save profile data to localStorage
      localStorage.setItem("vaya_driver_profile", JSON.stringify(formData))
      localStorage.setItem("vaya_profile_complete", "true")

      toast({
        title: t("success"),
        description: t("profileCreated"),
      })

      // Redirect to dashboard
      router.push("/dashboard")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className={`text-2xl font-bold text-center ${fontSizeClass}`}>{t("createProfile")}</CardTitle>
          <CardDescription className="text-center">{t("createProfileDescription")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={fontSizeClass}>
                {t("fullName")}
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={fontSizeClass}
                placeholder={t("enterFullName")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadhaarNumber" className={fontSizeClass}>
                {t("aadhaarNumber")}
              </Label>
              <Input
                id="aadhaarNumber"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                className={fontSizeClass}
                placeholder={t("enter12DigitAadhaar")}
                maxLength={12}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className={fontSizeClass}>
                {t("licenseNumber")}
              </Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className={fontSizeClass}
                placeholder={t("enterLicenseNumber")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType" className={fontSizeClass}>
                {t("vehicleType")}
              </Label>
              <Select value={formData.vehicleType} onValueChange={handleVehicleTypeChange}>
                <SelectTrigger className={fontSizeClass}>
                  <SelectValue placeholder={t("selectVehicleType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">{t("auto")}</SelectItem>
                  <SelectItem value="bike">{t("bike")}</SelectItem>
                  <SelectItem value="car">{t("car")}</SelectItem>
                  <SelectItem value="tractor">{t("tractor")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleNumber" className={fontSizeClass}>
                {t("vehicleNumber")}
              </Label>
              <Input
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className={fontSizeClass}
                placeholder={t("enterVehicleNumber")}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2">{t("submitting")}</span>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </>
              ) : (
                t("createProfile")
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
