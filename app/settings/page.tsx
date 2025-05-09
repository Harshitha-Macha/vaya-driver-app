// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { useLocale } from "@/components/locale-provider"
// import { useFontSize } from "@/lib/font-size-provider"
// import { PageHeader } from "@/components/page-header"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/components/ui/use-toast"
// import type { Language } from "@/utils/i18n"
// import type { FontSize } from "@/lib/font-size-provider"

// export default function SettingsPage() {
//   const router = useRouter()
//   const { t, locale, setLocale } = useLocale()
//   const { fontSize, setFontSize } = useFontSize()
//   const { toast } = useToast()
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedFontSize, setSelectedFontSize] = useState<FontSize>(fontSize)
//   const [selectedLanguage, setSelectedLanguage] = useState<Language>(locale)

//   useEffect(() => {
//     // Check if user is authenticated
//     const authToken = localStorage.getItem("vaya_auth_token")
//     if (!authToken) {
//       router.push("/auth/login")
//       return
//     }

//     // Simulate loading data
//     const timer = setTimeout(() => {
//       setIsLoading(false)
//     }, 1000)

//     return () => clearTimeout(timer)
//   }, [router])

//   const handleSaveSettings = () => {
//     setFontSize(selectedFontSize)
//     setLocale(selectedLanguage)

//     toast({
//       title: t("success"),
//       description: t("settingsSaved"),
//     })
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen">
//       <PageHeader title={t("settings")} />

//       <div className="p-4 space-y-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>{t("fontSize")}</CardTitle>
//             <CardDescription>{t("Choose your preferred font size for the app")}</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <RadioGroup
//               value={selectedFontSize}
//               onValueChange={(value) => setSelectedFontSize(value as FontSize)}
//               className="flex flex-col space-y-2"
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="small" id="small" />
//                 <Label htmlFor="small" className="text-sm">
//                   {t("small")}
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="medium" id="medium" />
//                 <Label htmlFor="medium" className="text-base">
//                   {t("medium")}
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="large" id="large" />
//                 <Label htmlFor="large" className="text-lg">
//                   {t("large")}
//                 </Label>
//               </div>
//             </RadioGroup>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>{t("language")}</CardTitle>
//             <CardDescription>{t("Choose your preferred language")}</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <RadioGroup
//               value={selectedLanguage}
//               onValueChange={(value) => setSelectedLanguage(value as Language)}
//               className="flex flex-col space-y-2"
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="en" id="en" />
//                 <Label htmlFor="en">English</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="hi" id="hi" />
//                 <Label htmlFor="hi">हिंदी</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="te" id="te" />
//                 <Label htmlFor="te">తెలుగు</Label>
//               </div>
//             </RadioGroup>
//           </CardContent>
//         </Card>

//         <Button onClick={handleSaveSettings} className="w-full bg-black hover:bg-gray-800 text-white">
//           {t("saveChanges")}
//         </Button>
//       </div>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { useFontSize } from "@/lib/font-size-provider"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { Language } from "@/utils/i18n"
import type { FontSize } from "@/lib/font-size-provider"

export default function SettingsPage() {
  const router = useRouter()
  const { t, locale, setLocale } = useLocale()
  const { fontSize, setFontSize } = useFontSize()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFontSize, setSelectedFontSize] = useState<FontSize>(fontSize)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(locale)

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

  const handleSaveSettings = () => {
    setFontSize(selectedFontSize)
    setLocale(selectedLanguage)

    toast({
      title: t("success"),
      description: t("settingsSaved"),
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
      <PageHeader title={t("settings")} />

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("fontSize")}</CardTitle>
            <CardDescription>{t("Choose your preferred font size for the app")}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedFontSize}
              onValueChange={(value: string) => setSelectedFontSize(value as FontSize)} // Explicitly typing the value
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small" className="text-sm">
                  {t("small")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-base">
                  {t("medium")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large" className="text-lg">
                  {t("large")}
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("language")}</CardTitle>
            <CardDescription>{t("Choose your preferred language")}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedLanguage}
              onValueChange={(value: string) => setSelectedLanguage(value as Language)} // Explicitly typing the value
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hi" id="hi" />
                <Label htmlFor="hi">हिंदी</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="te" id="te" />
                <Label htmlFor="te">తెలుగు</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Button onClick={handleSaveSettings} className="w-full bg-black hover:bg-gray-800 text-white">
          {t("saveChanges")}
        </Button>
      </div>
    </div>
  )
}

