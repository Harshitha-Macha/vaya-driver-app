import Image from "next/image"
import Link from "next/link"

export function AppLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/dashboard" className={`flex items-center ${className}`}>
      <div className="relative h-8 w-8 mr-2">
        <Image src="/logo.jpg" alt="Vaya Logo" fill className="object-contain" priority />
      </div>
      <span className="font-bold text-lg">Vaya</span>
    </Link>
  )
}
