"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getTranslation, type Language } from "@/utils/i18n"

type LocaleContextType = {
  t: (key: string) => string
  locale: Language
  setLocale: (locale: Language) => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Language>("en")

  useEffect(() => {
    // Get saved language preference from localStorage
    const savedLocale = localStorage.getItem("vaya_locale") as Language
    if (savedLocale && ["en", "hi", "te"].includes(savedLocale)) {
      setLocale(savedLocale)
    }
  }, [])

  const changeLocale = (newLocale: Language) => {
    setLocale(newLocale)
    localStorage.setItem("vaya_locale", newLocale)
  }

  const t = (key: string): string => {
    return getTranslation(locale, key)
  }

  return <LocaleContext.Provider value={{ t, locale, setLocale: changeLocale }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
