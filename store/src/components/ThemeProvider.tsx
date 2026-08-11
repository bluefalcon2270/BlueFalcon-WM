"use client"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
type ThemeCtx = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const stored = localStorage.getItem("bfwm-theme") as Theme | null
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const t = stored ?? sys
    setTheme(t)
    document.documentElement.classList.toggle("dark", t === "dark")
  }, [])

  const toggle = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark"
      localStorage.setItem("bfwm-theme", next)
      document.documentElement.classList.toggle("dark", next === "dark")
      return next
    })
  }

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
