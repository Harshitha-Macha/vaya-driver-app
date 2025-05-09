// "use client"

// import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// type FontSize = "small" | "medium" | "large"

// type FontSizeContextType = {
//   fontSize: FontSize
//   setFontSize: (size: FontSize) => void
//   fontSizeClass: string
// }

// const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

// export function FontSizeProvider({ children }: { children: ReactNode }) {
//   const [fontSize, setFontSize] = useState<FontSize>("medium")

//   useEffect(() => {
//     // Get saved font size preference from localStorage
//     const savedFontSize = localStorage.getItem("vaya_font_size") as FontSize
//     if (savedFontSize && ["small", "medium", "large"].includes(savedFontSize)) {
//       setFontSize(savedFontSize)
//     }
//   }, [])

//   const changeFontSize = (newSize: FontSize) => {
//     setFontSize(newSize)
//     localStorage.setItem("vaya_font_size", newSize)
//   }

//   // Map font size to Tailwind classes
//   const getFontSizeClass = (): string => {
//     switch (fontSize) {
//       case "small":
//         return "text-sm"
//       case "large":
//         return "text-lg"
//       case "medium":
//       default:
//         return "text-base"
//     }
//   }

//   return (
//     <FontSizeContext.Provider
//       value={{
//         fontSize,
//         setFontSize: changeFontSize,
//         fontSizeClass: getFontSizeClass(),
//       }}
//     >
//       <div className={getFontSizeClass()}>{children}</div>
//     </FontSizeContext.Provider>
//   )
// }

// export function useFontSize() {
//   const context = useContext(FontSizeContext)
//   if (context === undefined) {
//     throw new Error("useFontSize must be used within a FontSizeProvider")
//   }
//   return context
// }


"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Export the FontSize type
export type FontSize = "small" | "medium" | "large"

type FontSizeContextType = {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  fontSizeClass: string
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("medium")

  useEffect(() => {
    // Get saved font size preference from localStorage
    const savedFontSize = localStorage.getItem("vaya_font_size") as FontSize
    if (savedFontSize && ["small", "medium", "large"].includes(savedFontSize)) {
      setFontSize(savedFontSize)
    }
  }, [])

  const changeFontSize = (newSize: FontSize) => {
    setFontSize(newSize)
    localStorage.setItem("vaya_font_size", newSize)
  }

  // Map font size to Tailwind classes
  const getFontSizeClass = (): string => {
    switch (fontSize) {
      case "small":
        return "text-sm"
      case "large":
        return "text-lg"
      case "medium":
      default:
        return "text-base"
    }
  }

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        setFontSize: changeFontSize,
        fontSizeClass: getFontSizeClass(),
      }}
    >
      <div className={getFontSizeClass()}>{children}</div>
    </FontSizeContext.Provider>
  )
}

export function useFontSize() {
  const context = useContext(FontSizeContext)
  if (context === undefined) {
    throw new Error("useFontSize must be used within a FontSizeProvider")
  }
  return context
}
