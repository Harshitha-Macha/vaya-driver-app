"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem("vaya_auth_token")

    // Public routes that don't require authentication
    const publicRoutes = ["/auth/login", "/auth/verify"]

    // Routes that don't require profile completion
    const noProfileRoutes = [...publicRoutes, "/create-profile"]

    // If not authenticated and not on a public route, redirect to login
    if (!authToken && !publicRoutes.includes(pathname)) {
      router.push("/auth/login")
      return
    }

    // If authenticated but profile not complete and not on a route that doesn't require profile
    if (authToken && localStorage.getItem("vaya_profile_complete") !== "true" && !noProfileRoutes.includes(pathname)) {
      router.push("/create-profile")
      return
    }
  }, [router, pathname])

  return <>{children}</>
}
