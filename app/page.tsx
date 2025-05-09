"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("vaya_auth_token")

    // Redirect after a small delay to simulate checking auth status
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.push("/dashboard")
      } else {
        router.push("/auth/login")
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Vaya Driver</h1>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    </div>
  )
}
