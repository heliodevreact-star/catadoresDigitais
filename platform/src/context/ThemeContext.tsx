'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggle: () => void
}

const DARK = {
  '--c-bg': '#03060F',
  '--c-bg-alt': '#0A0F1E',
  '--c-text': '#F4F7FF',
  '--c-muted': '#B7C0D8',
  '--c-subtle': '#8C97B8',
  '--c-faint': '#4E5A7B',
  '--c-border': 'rgba(255,255,255,0.10)',
  '--c-border-md': 'rgba(255,255,255,0.18)',
  '--c-accent-green': '#CFF183',
  '--c-accent-green-soft': 'rgba(131,184,13,0.10)',
  '--c-accent-green-strong': 'rgba(131,184,13,0.45)',
  '--c-accent-blue': '#84A4FF',
  '--c-accent-blue-soft': 'rgba(17,75,242,0.10)',
  '--c-accent-blue-strong': 'rgba(17,75,242,0.45)',

  '--c-success': '#22c55e',
  '--c-success-soft': 'rgba(34,197,94,0.10)',
  '--c-success-strong': 'rgba(34,197,94,0.45)',
  '--c-warning': '#f59e0b',
  '--c-warning-soft': 'rgba(245,158,11,0.10)',
  '--c-warning-strong': 'rgba(245,158,11,0.45)',
  '--c-danger': '#ef4444',
  '--c-danger-soft': 'rgba(239,68,68,0.10)',
  '--c-danger-strong': 'rgba(239,68,68,0.45)',
  '--c-info': '#06B6D4',
  '--c-info-soft': 'rgba(6,182,212,0.10)',
  '--c-info-strong': 'rgba(6,182,212,0.45)',
}

const LIGHT = {
  '--c-bg': '#FFFFFF',
  '--c-bg-alt': '#F6F6F7',
  '--c-text': '#1A0A3C',
  '--c-muted': '#5B4B7A',
  '--c-subtle': '#6D5E88',
  '--c-faint': '#6E5E8C',
  '--c-border': 'rgba(26,10,60,0.10)',
  '--c-border-md': 'rgba(26,10,60,0.18)',
  '--c-accent-green': '#517208',
  '--c-accent-green-soft': 'rgba(131,184,13,0.14)',
  '--c-accent-green-strong': 'rgba(131,184,13,0.32)',
  '--c-accent-blue': '#114BF2',
  '--c-accent-blue-soft': 'rgba(17,75,242,0.14)',
  '--c-accent-blue-strong': 'rgba(17,75,242,0.32)',

  '--c-success': '#15803d',
  '--c-success-soft': 'rgba(34,197,94,0.12)',
  '--c-success-strong': 'rgba(34,197,94,0.30)',
  '--c-warning': '#b45309',
  '--c-warning-soft': 'rgba(245,158,11,0.14)',
  '--c-warning-strong': 'rgba(245,158,11,0.32)',
  '--c-danger': '#b91c1c',
  '--c-danger-soft': 'rgba(239,68,68,0.10)',
  '--c-danger-strong': 'rgba(239,68,68,0.28)',
  '--c-info': '#0e7490',
  '--c-info-soft': 'rgba(6,182,212,0.12)',
  '--c-info-strong': 'rgba(6,182,212,0.30)',
}

function applyTheme(dark: boolean) {
  const vars = dark ? DARK : LIGHT
  const root = document.documentElement
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
}

const ThemeContext = createContext<ThemeContextType>({ isDark: true, toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('cd-theme')
    const dark = stored ? stored === 'dark' : true
    setIsDark(dark)
    applyTheme(dark)
  }, [])

  function toggle() {
    setIsDark((prev) => {
      const next = !prev
      applyTheme(next)
      localStorage.setItem('cd-theme', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
