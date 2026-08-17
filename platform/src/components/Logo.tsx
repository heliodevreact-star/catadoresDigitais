'use client'

import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}

const ICON_SRC = {
  light: '/logo_icon_lightmode.png',
  dark: '/logo_icon_darkmode.png',
}

export function Logo({ size = 'md', showTagline = false }: LogoProps) {
  const { isDark } = useTheme()

  const sizes = {
    sm: { icon: 28, wordMark: 'text-base', tag: 'text-[9px]', gap: 'gap-2' },
    md: { icon: 34, wordMark: 'text-lg', tag: 'text-[10px]', gap: 'gap-2.5' },
    lg: { icon: 48, wordMark: 'text-2xl', tag: 'text-xs', gap: 'gap-3' },
  }
  const s = sizes[size]

  return (
    <div className="flex flex-col leading-none">
      <div className={`flex items-center ${s.gap}`}>
        <Image
          src={isDark ? ICON_SRC.dark : ICON_SRC.light}
          alt="Catadores Digitais"
          width={107}
          height={107}
          style={{ height: s.icon, width: 'auto' }}
          className="object-contain flex-shrink-0"
        />
        <span
          className={`font-bold tracking-wide leading-none whitespace-nowrap ${s.wordMark}`}
          style={{ color: 'var(--c-text)', fontFamily: "'Inter', sans-serif" }}
        >
          CATADORES DIGITAIS
        </span>
      </div>
      {showTagline && (
        <span className={`font-medium text-[var(--c-subtle)] mt-1.5 tracking-widest uppercase ${s.tag}`}>
          Tecnologia que transforma
        </span>
      )}
    </div>
  )
}
