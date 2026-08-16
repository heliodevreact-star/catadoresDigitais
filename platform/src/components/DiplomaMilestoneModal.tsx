'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiXMark, HiCheckBadge } from 'react-icons/hi2'
import { inputStyle } from '@/lib/styles'
import type { DiplomaMilestone } from '@/types'

const ease = [0.32, 0.72, 0, 1] as const

interface StudentOption {
  email: string
  name: string | null
}

interface SaveInput {
  title: string
  description?: string
  achievedDate: string
  hours: number
  recipientEmails: string[]
}

interface Props {
  turmaId: string
  turmaIconColor: string
  turmaStartDate: string
  turmaEndDate: string
  milestone?: DiplomaMilestone
  onClose: () => void
  onCreate: (input: SaveInput) => Promise<unknown>
  onUpdate?: (input: SaveInput & { milestoneId: string }) => Promise<unknown>
  onCreated: () => void
}

export function DiplomaMilestoneModal({
  turmaId, turmaIconColor, turmaStartDate, turmaEndDate, milestone, onClose, onCreate, onUpdate, onCreated,
}: Props) {
  const isEdit = !!milestone
  const [title, setTitle] = useState(milestone?.title ?? '')
  const [description, setDescription] = useState(milestone?.description ?? '')
  const [achievedDate, setAchievedDate] = useState(milestone?.achievedDate ?? '')
  const [hours, setHours] = useState(milestone?.hours ? String(milestone.hours) : '')
  const [students, setStudents] = useState<StudentOption[]>([])
  const [selected, setSelected] = useState<string[]>(milestone?.recipientEmails ?? [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/turmas/${turmaId}/students`)
      .then((r) => r.ok ? r.json() : [])
      .then(setStudents)
      .catch(() => {})
  }, [turmaId])

  function toggleStudent(email: string) {
    setSelected((s) => s.includes(email) ? s.filter((e) => e !== email) : [...s, email])
  }

  async function handleSave() {
    if (!title.trim()) return setError('O título é obrigatório.')
    if (!achievedDate) return setError('Selecione a data em que o marco foi alcançado.')
    const hoursNum = Number(hours)
    if (!Number.isFinite(hoursNum) || hoursNum <= 0) return setError('Informe a carga horária (em horas).')
    setError(null)
    setSaving(true)
    try {
      const input: SaveInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        achievedDate,
        hours: hoursNum,
        recipientEmails: selected,
      }
      if (isEdit && onUpdate) {
        await onUpdate({ ...input, milestoneId: milestone.id })
      } else {
        await onCreate(input)
      }
      onCreated()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar diploma.')
    } finally {
      setSaving(false)
    }
  }

  const unselected = students.filter((s) => !selected.includes(s.email))
  const selectedStudents = students.filter((s) => selected.includes(s.email))

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
                {isEdit ? 'Editar marco de diploma' : 'Novo marco de diploma'}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do diploma"
              className="w-full text-lg font-bold bg-transparent border-b outline-none pb-1"
              style={{ borderColor: 'var(--c-border-md)', color: 'var(--c-text)' }}
              autoFocus
            />
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
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-medium" style={{ color: 'var(--c-subtle)' }}>
                Data em que o marco foi alcançado
              </label>
              <input
                type="date"
                value={achievedDate}
                min={turmaStartDate}
                max={turmaEndDate}
                onChange={(e) => setAchievedDate(e.target.value)}
                className="rounded-xl px-3 py-2 text-sm border outline-none"
                style={inputStyle}
              />
            </div>
            <div className="flex flex-col gap-1.5" style={{ width: 140 }}>
              <label className="text-xs font-medium" style={{ color: 'var(--c-subtle)' }}>
                Carga horária
              </label>
              <input
                type="number"
                min={1}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Horas"
                className="rounded-xl px-3 py-2 text-sm border outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--c-subtle)' }}>
              Descrição (opcional)
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Ex: "concluiu o módulo 1 do curso"'
              rows={2}
              className="rounded-xl px-3 py-2.5 text-sm border outline-none resize-none"
              style={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--c-subtle)' }}>
              Alunos ({selected.length} selecionado{selected.length !== 1 ? 's' : ''})
            </p>
            {selectedStudents.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedStudents.map((s) => (
                  <span
                    key={s.email}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                    style={{ borderColor: turmaIconColor, color: turmaIconColor, background: `${turmaIconColor}12` }}
                  >
                    {s.name ?? s.email}
                    <button type="button" onClick={() => toggleStudent(s.email)} className="opacity-70 hover:opacity-100">
                      <HiXMark className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {unselected.length > 0 && (
              <select
                value=""
                onChange={(e) => { if (e.target.value) toggleStudent(e.target.value); e.target.value = '' }}
                className="rounded-xl px-3 py-2 text-sm border outline-none"
                style={inputStyle}
              >
                <option value="">Adicionar aluno...</option>
                {unselected.map((s) => (
                  <option key={s.email} value={s.email}>{s.name ?? s.email}</option>
                ))}
              </select>
            )}
            {students.length === 0 && (
              <p className="text-xs" style={{ color: 'var(--c-faint)' }}>Nenhum aluno matriculado nesta turma.</p>
            )}
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
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-opacity disabled:opacity-50"
              style={{ background: turmaIconColor, color: '#fff' }}
            >
              {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar marco'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
