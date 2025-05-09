// import type React from "react"
// import { Inter } from "next/font/google"
// import { Toaster } from "@/components/ui/toaster"
// import { LocaleProvider } from "@/components/locale-provider"
// import { ThemeProvider } from "@/components/theme-provider"
// import { FontSizeProvider } from "@/lib/font-size-provider"
// import "@/app/globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "Vaya Driver",
//   description: "Vaya driver-side web application",
//     generator: 'v0.dev'
// }

// export default function RootLayout({
//   children,
// }: {
  
//   children: React.ReactNode
// }) {
//   return (
    
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} themes={["light", "dark"]}>
//           <LocaleProvider>
//             <FontSizeProvider>
//               <main className="min-h-screen bg-background">{children}</main>
//               <Toaster />
//             </FontSizeProvider>
//           </LocaleProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }


import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { LocaleProvider } from "@/components/locale-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { FontSizeProvider } from "@/lib/font-size-provider"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Vaya Driver",
  description: "Vaya driver-side web application",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          themes={["light", "dark"]}
        >
          <LocaleProvider>
            <FontSizeProvider>
              <main className="min-h-screen bg-background">{children}</main>
              <Toaster />
            </FontSizeProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
