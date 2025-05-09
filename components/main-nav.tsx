"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Home, Clock, IndianRupee, HelpCircle, Settings, LogOut, User } from "lucide-react"

interface MainNavProps {
  isOnline?: boolean
}

export function MainNav({ isOnline }: MainNavProps) {
  const router = useRouter()
  const { t } = useLocale()

  const handleLogout = () => {
    localStorage.removeItem("vaya_auth_token")
    localStorage.removeItem("vaya_phone")
    router.push("/auth/login")
  }

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: Clock,
      label: "History",
      href: "/history",
    },
    {
      icon: IndianRupee,
      label: "My Earnings",
      href: "/earnings",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      href: "/support",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
    },
    {
      icon: User,
      label: "Profile",
      href: "/profile",
    },
  ]

  return (
    <div className="flex items-center">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px]">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="flex items-center">
              <span className="text-xl font-bold">Vaya Driver</span>
              {isOnline !== undefined && (
                <div className={`ml-2 h-3 w-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <nav className="flex flex-col space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="justify-start h-10"
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  <span>{t(item.label.toLowerCase())}</span>
                </Button>
              ))}
              <Button
                variant="ghost"
                className="justify-start h-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span>{t("logout")}</span>
              </Button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
