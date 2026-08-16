'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { HiXMark, HiCheckBadge, HiArrowTopRightOnSquare } from 'react-icons/hi2'
import type { DiplomaMilestone } from '@/types'
import { inputStyle } from '@/lib/styles'
import { isValidCPF, formatCPF } from '@/lib/utils'

const ease = [0.32, 0.72, 0, 1] as const

interface StudentOption {
  email: string
  name: string | null
  cpf: string | null
}

interface IssueResult {
  issued: { id: string; email: string }[]
  skipped: { email: string; reason: string }[]
}

interface Props {
  turmaId: string
  turmaIconColor: string
  milestone: DiplomaMilestone
  onClose: () => void
  onIssue: (input: { milestoneId: string; recipients: { email: string; cpf: string }[] }) => Promise<IssueResult>
  onIssued: () => void
}

export function DiplomaIssueModal({ turmaId, turmaIconColor, milestone, onClose, onIssue, onIssued }: Props) {
  const [students, setStudents] = useState<StudentOption[]>([])
  const [cpfByEmail, setCpfByEmail] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<IssueResult | null>(null)

  useEffect(() => {
    fetch(`/api/turmas/${turmaId}/students`)
      .then((r) => r.ok ? r.json() : [])
      .then((all: StudentOption[]) => {
        setStudents(all)
        const initial: Record<string, string> = {}
        for (const s of all) {
          if (s.cpf) initial[s.email] = formatCPF(s.cpf)
        }
        setCpfByEmail(initial)
      })
      .catch(() => {})
  }, [turmaId])

  const pending = useMemo(
    () => milestone.recipientEmails.filter((e) => !milestone.issuedEmails.includes(e)),
    [milestone],
  )

  const byEmail = useMemo(() => new Map(students.map((s) => [s.email, s])), [students])

  const allValid = pending.length > 0 && pending.every((email) => isValidCPF(cpfByEmail[email] ?? ''))

  async function handleIssue() {
    if (!allValid) return
    setError(null)
    setSaving(true)
    try {
      const recipients = pending.map((email) => ({
        email,
        cpf: (cpfByEmail[email] ?? '').replace(/\D/g, ''),
      }))
      const res = await onIssue({ milestoneId: milestone.id, recipients })
      setResult(res)
      onIssued()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao emitir diplomas.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 8 }}
        transition={{ duration: 0.25, ease }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col"
        style={{ background: 'var(--c-bg-alt)', border: '1px solid var(--c-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b flex-shrink-0" style={{ borderColor: 'var(--c-border)' }}>
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-2 mb-1">
              <HiCheckBadge className="w-4 h-4 flex-shrink-0" style={{ color: turmaIconColor }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: turmaIconColor }}>
                Emitir diplomas
              </span>
            </div>
            <h2 className="text-lg font-bold leading-snug" style={{ color: 'var(--c-text)' }}>{milestone.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center border"
            style={{ borderColor: 'var(--c-border-md)', color: 'var(--c-subtle)' }}
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 p-5 overflow-y-auto">
          {result ? (
            <div className="flex flex-col gap-3">
              {result.issued.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--c-success)' }}>
                    Emitidos ({result.issued.length})
                  </p>
                  {result.issued.map((i) => (
                    <a
                      key={i.id}
                      href={`/diploma/${i.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 text-sm rounded-xl border px-3 py-2 transition-opacity hover:opacity-80"
                      style={{ borderColor: 'var(--c-border)', color: 'var(--c-text)' }}
                    >
                      {byEmail.get(i.email)?.name ?? i.email}
                      <HiArrowTopRightOnSquare className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--c-subtle)' }} />
                    </a>
                  ))}
                </div>
              )}
              {result.skipped.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--c-warning)' }}>
                    Não emitidos ({result.skipped.length})
                  </p>
                  {result.skipped.map((s) => (
                    <p key={s.email} className="text-xs" style={{ color: 'var(--c-subtle)' }}>
                      {byEmail.get(s.email)?.name ?? s.email} — {s.reason}
                    </p>
                  ))}
                </div>
              )}
              <button
                onClick={onClose}
                className="mt-1 py-2.5 rounded-xl text-sm font-bold transition-opacity"
                style={{ background: turmaIconColor, color: '#fff' }}
              >
                Fechar
              </button>
            </div>
          ) : pending.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--c-subtle)' }}>
              Todos os alunos selecionados para este marco já receberam o diploma.
            </p>
          ) : (
            <>
              <p className="text-xs" style={{ color: 'var(--c-subtle)' }}>
                Confirme o CPF de cada aluno antes de emitir — o diploma é gerado com esses dados e não muda depois.
              </p>
              <div className="flex flex-col gap-3">
                {pending.map((email) => {
                  const student = byEmail.get(email)
                  const value = cpfByEmail[email] ?? ''
                  const valid = isValidCPF(value)
                  return (
                    <div key={email} className="flex flex-col gap-1.5 rounded-xl border p-3" style={{ borderColor: 'var(--c-border)' }}>
                      <p className="text-sm font-medium" style={{ color: 'var(--c-text)' }}>{student?.name ?? email}</p>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setCpfByEmail((m) => ({ ...m, [email]: formatCPF(e.target.value.replace(/\D/g, '')) }))}
                        placeholder="000.000.000-00"
                        className="rounded-lg px-3 py-2 text-sm border outline-none"
                        style={{ ...inputStyle, borderColor: value && !valid ? 'var(--c-danger)' : inputStyle.borderColor }}
                      />
                      {value && !valid && (
                        <span className="text-xs" style={{ color: 'var(--c-danger)' }}>CPF inválido.</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {error && <p className="text-sm" style={{ color: 'var(--c-danger)' }}>{error}</p>}

              <div className="flex gap-2 mt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm border"
                  style={{ borderColor: 'var(--c-border-md)', color: 'var(--c-muted)' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleIssue}
                  disabled={saving || !allValid}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-opacity disabled:opacity-50"
                  style={{ background: turmaIconColor, color: '#fff' }}
                >
                  {saving ? 'Emitindo...' : `Emitir ${pending.length} diploma${pending.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
