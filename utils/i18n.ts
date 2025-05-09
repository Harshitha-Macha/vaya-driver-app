import { en } from "@/lib/locales/en"
import { hi } from "@/lib/locales/hi"
import { te } from "@/lib/locales/te"

export type Language = "en" | "hi" | "te"

export const languages: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  te: "తెలుగు",
}

export const translations: Record<Language, Record<string, string>> = {
  en,
  hi,
  te,
}

export function getTranslation(locale: Language, key: string): string {
  return translations[locale][key] || key
}
