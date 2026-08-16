'use client'

import { useState, useEffect } from 'react'
import { HiTrophy, HiCheckBadge, HiClock, HiArrowTopRightOnSquare } from 'react-icons/hi2'
import type { Turma } from '@/types'
import { fmtDate } from '@/lib/date-utils'

interface EarnedDiploma {
  id: string
  title: string
  description?: string
  achievedDate: string
}

interface PendingDiploma {
  milestoneId: string
  title: string
  description?: string
  achievedDate: string
}

interface Props {
  turma: Turma
}

export function ConquistasPanel({ turma }: Props) {
  const [earned, setEarned] = useState<EarnedDiploma[]>([])
  const [pending, setPending] = useState<PendingDiploma[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/turmas/${turma.id}/diplomas/mine`)
      .then((r) => r.ok ? r.json() : { earned: [], pending: [] })
      .then((data) => {
        setEarned(data.earned ?? [])
        setPending(data.pending ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [turma.id])

  if (loading) {
    return <p className="text-xs px-5 py-4" style={{ color: 'var(--c-subtle)' }}>Carregando...</p>
  }

  if (earned.length === 0 && pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
        <HiTrophy className="w-10 h-10" style={{ color: 'var(--c-faint)' }} />
        <p className="font-semibold" style={{ color: 'var(--c-text)' }}>Nenhuma conquista ainda</p>
        <p className="text-sm" style={{ color: 'var(--c-subtle)' }}>
          Seus diplomas desta turma vão aparecer aqui conforme você avança no curso.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-5">
      {earned.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--c-subtle)' }}>
            Conquistados
          </p>
          <div className="flex flex-col gap-2">
            {earned.map((d) => (
              <a
                key={d.id}
                href={`/diploma/${d.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border overflow-hidden transition-opacity hover:opacity-80"
                style={{ borderColor: 'var(--c-border)', background: 'var(--c-bg-alt)' }}
              >
                <div className="px-4 py-3 flex items-center gap-3" style={{ borderLeft: `3px solid ${turma.iconColor}` }}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${turma.iconColor}20`, color: turma.iconColor }}
                  >
                    <HiCheckBadge className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--c-text)' }}>{d.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--c-subtle)' }}>{fmtDate(d.achievedDate)}</p>
                  </div>
                  <HiArrowTopRightOnSquare className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--c-faint)' }} />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--c-subtle)' }}>
            Em andamento
          </p>
          <div className="flex flex-col gap-2">
            {pending.map((m) => (
              <div
                key={m.milestoneId}
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: 'var(--c-border)', background: 'var(--c-bg-alt)' }}
              >
                <div className="px-4 py-3 flex items-center gap-3" style={{ borderLeft: '3px solid var(--c-faint)' }}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--c-border)', color: 'var(--c-subtle)' }}
                  >
                    <HiClock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--c-text)' }}>{m.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--c-subtle)' }}>{fmtDate(m.achievedDate)}</p>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: 'var(--c-border)', color: 'var(--c-subtle)' }}
                  >
                    Aguardando emissão
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
