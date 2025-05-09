import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { LocaleProvider } from "@/components/locale-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { FontSizeProvider } from "@/lib/font-size-provider"
import { RouteGuard } from "@/lib/route-guard"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Vaya Driver",
  description: "Vaya driver-side web application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} themes={["light", "dark"]}>
          <LocaleProvider>
            <FontSizeProvider>
              <RouteGuard>
                <main className="min-h-screen bg-background">{children}</main>
                <Toaster />
              </RouteGuard>
            </FontSizeProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
