"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { MainNav } from "@/components/main-nav"

interface PageHeaderProps {
  title: string
  showBackButton?: boolean
  backUrl?: string
}

export function PageHeader({ title, showBackButton = true, backUrl = "/dashboard" }: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-10 bg-white border-b p-4">
      <div className="flex items-center">
        {showBackButton ? (
          <Button variant="ghost" size="icon" onClick={() => router.push(backUrl)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <MainNav />
        )}
        <h1 className="ml-2 text-lg font-bold">{title}</h1>
      </div>
    </header>
  )
}
