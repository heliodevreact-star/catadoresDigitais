import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }}>
      {children}
    </div>
  )
}
