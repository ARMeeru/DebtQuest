"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // After mounting, we can remove the no-transition class and add the theme-transition class
  useEffect(() => {
    // Add no-transition class to prevent transitions on initial load
    document.documentElement.classList.add("no-transition")

    // Wait for a short time to ensure the theme is applied
    const timeout = setTimeout(() => {
      setMounted(true)
      document.documentElement.classList.remove("no-transition")
      document.documentElement.classList.add("theme-transition")
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
