"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { AppLogo } from "@/components/app-logo"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("vaya_auth_token")
    const profileComplete = localStorage.getItem("vaya_profile_complete")

    // Redirect after a small delay to simulate checking auth status
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        if (profileComplete === "true") {
          router.push("/dashboard")
        } else {
          router.push("/create-profile")
        }
      } else {
        router.push("/auth/login")
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <AppLogo className="mb-4 scale-150" />
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    </div>
  )
}
