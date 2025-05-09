"use client"

import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import { languages, type Language } from "@/utils/i18n"

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale()

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-sm font-medium">{t("language")}</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(languages).map(([code, name]) => (
          <Button
            key={code}
            variant={locale === code ? "default" : "outline"}
            className={locale === code ? "bg-black text-white" : ""}
            onClick={() => setLocale(code as Language)}
            size="sm"
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  )
}
