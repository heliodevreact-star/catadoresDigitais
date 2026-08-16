'use client'

import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  HiCheckBadge, HiPlus, HiTrash, HiPencilSquare, HiChevronDown, HiChevronUp,
  HiArrowTopRightOnSquare, HiPhoto, HiUsers,
} from 'react-icons/hi2'
import type { Turma, UserProfile, DiplomaMilestone } from '@/types'
import { fmtDate } from '@/lib/date-utils'
import { inputStyle } from '@/lib/styles'
import { resizeImageToDataUrl } from '@/lib/image-resize'
import { useDiplomas, useIssuedDiplomas } from '@/hooks/useDiplomas'
import { DiplomaMilestoneModal } from './DiplomaMilestoneModal'
import { DiplomaIssueModal } from './DiplomaIssueModal'
import { Tooltip } from './Tooltip'

const ease = [0.32, 0.72, 0, 1] as const

interface Props {
  turma: Turma
  currentUser: UserProfile | null
  onRefresh: () => void
}

export function DiplomasPanel({ turma, currentUser, onRefresh }: Props) {
  const isAdmin = currentUser?.role === 'admin'
  const {
    milestones, milestonesLoading, createMilestone, updateMilestone, deleteMilestone, deletingMilestone, issueMilestone,
  } = useDiplomas(turma.id)

  const [creatingMilestone, setCreatingMilestone] = useState(false)
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null)
  const [issuingMilestoneId, setIssuingMilestoneId] = useState<string | null>(null)

  return (
    <div className="p-4 flex flex-col gap-5">
      {isAdmin && <CoordinatorSettings turma={turma} onRefresh={onRefresh} />}

      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--c-subtle)' }}>
          Marcos de diploma
        </p>
        <button
          onClick={() => setCreatingMilestone(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-opacity hover:opacity-80"
          style={{ borderColor: turma.iconColor, color: turma.iconColor }}
        >
          <HiPlus className="w-3.5 h-3.5" /> Novo marco
        </button>
      </div>

      {milestonesLoading ? (
        <p className="text-xs px-1" style={{ color: 'var(--c-subtle)' }}>Carregando...</p>
      ) : milestones.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
          <HiCheckBadge className="w-10 h-10" style={{ color: 'var(--c-faint)' }} />
          <p className="font-semibold" style={{ color: 'var(--c-text)' }}>Nenhum diploma criado ainda</p>
          <p className="text-sm" style={{ color: 'var(--c-subtle)' }}>
            Crie um marco (ex: Conclusão do módulo 1) e emita diplomas pros alunos que chegaram lá.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {milestones.map((m) => (
            <MilestoneCard
              key={m.id}
              turmaId={turma.id}
              turmaIconColor={turma.iconColor}
              milestone={m}
              isAdmin={isAdmin}
              deleting={deletingMilestone === m.id}
              onDelete={() => {
                if (confirm(`Apagar o marco "${m.title}"? Diplomas já emitidos não são afetados.`)) {
                  deleteMilestone(m.id)
                }
              }}
              onIssue={() => setIssuingMilestoneId(m.id)}
              onEdit={() => setEditingMilestoneId(m.id)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {creatingMilestone && (
          <DiplomaMilestoneModal
            turmaId={turma.id}
            turmaIconColor={turma.iconColor}
            turmaStartDate={turma.startDate}
            turmaEndDate={turma.endDate}
            onClose={() => setCreatingMilestone(false)}
            onCreate={createMilestone}
            onCreated={() => setCreatingMilestone(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingMilestoneId && (
          <DiplomaMilestoneModal
            turmaId={turma.id}
            turmaIconColor={turma.iconColor}
            turmaStartDate={turma.startDate}
            turmaEndDate={turma.endDate}
            milestone={milestones.find((m) => m.id === editingMilestoneId)}
            onClose={() => setEditingMilestoneId(null)}
            onCreate={createMilestone}
            onUpdate={updateMilestone}
            onCreated={() => setEditingMilestoneId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {issuingMilestoneId && (
          <DiplomaIssueModal
            turmaId={turma.id}
            turmaIconColor={turma.iconColor}
            milestone={milestones.find((m) => m.id === issuingMilestoneId)!}
            onClose={() => setIssuingMilestoneId(null)}
            onIssue={issueMilestone}
            onIssued={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function CoordinatorSettings({ turma, onRefresh }: { turma: Turma; onRefresh: () => void }) {
  const [name, setName] = useState(turma.coordinatorName ?? '')
  const [signature, setSignature] = useState(turma.coordinatorSignature ?? '')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const dataUrl = await resizeImageToDataUrl(file)
      setSignature(dataUrl)
      setDirty(true)
    } catch {
      // ignora: input volta ao estado anterior
    }
  }

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/admin/turmas/${turma.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinatorName: name.trim(), coordinatorSignature: signature }),
    })
    setSaving(false)
    setDirty(false)
    onRefresh()
  }

  return (
    <div className="rounded-2xl border p-4 flex flex-col gap-3" style={{ borderColor: 'var(--c-border)', background: 'var(--c-bg-alt)' }}>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--c-subtle)' }}>
        Coordenador(a) geral do curso
      </p>
      <p className="text-xs -mt-2" style={{ color: 'var(--c-faint)' }}>
        Nome e assinatura aparecem em todos os diplomas emitidos nesta turma.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setDirty(true) }}
          placeholder="Nome completo"
          className="flex-1 rounded-xl px-3 py-2 text-sm border outline-none"
          style={inputStyle}
        />

        <div className="flex items-center gap-2">
          {signature && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={signature} alt="Assinatura" className="h-9 rounded-md border" style={{ borderColor: 'var(--c-border-md)', background: '#fff' }} />
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-opacity hover:opacity-80"
            style={{ borderColor: 'var(--c-border-md)', color: 'var(--c-subtle)' }}
          >
            <HiPhoto className="w-3.5 h-3.5" /> {signature ? 'Trocar assinatura' : 'Enviar assinatura'}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
      </div>

      {dirty && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="self-start text-xs font-bold px-3.5 py-2 rounded-lg transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: turma.iconColor, color: '#fff' }}
        >
          {saving ? 'Salvando...' : 'Salvar coordenador'}
        </button>
      )}
    </div>
  )
}

interface MilestoneCardProps {
  turmaId: string
  turmaIconColor: string
  milestone: DiplomaMilestone
  isAdmin: boolean
  deleting: boolean
  onDelete: () => void
  onIssue: () => void
  onEdit: () => void
}

function MilestoneCard({ turmaId, turmaIconColor, milestone, isAdmin, deleting, onDelete, onIssue, onEdit }: MilestoneCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { issued, issuedLoading } = useIssuedDiplomas(turmaId, milestone.id, expanded)

  const pendingCount = milestone.recipientEmails.filter((e) => !milestone.issuedEmails.includes(e)).length

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--c-border)', background: 'var(--c-bg-alt)' }}>
      <div className="px-4 py-3 flex items-center gap-3" style={{ borderLeft: `3px solid ${turmaIconColor}` }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `${turmaIconColor}20`, color: turmaIconColor }}
        >
          <HiCheckBadge className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--c-text)' }}>{milestone.title}</p>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-xs" style={{ color: 'var(--c-subtle)' }}>{fmtDate(milestone.achievedDate)}</span>
            <span className="text-xs" style={{ color: 'var(--c-subtle)' }}>{milestone.hours}h</span>
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--c-subtle)' }}>
              <HiUsers className="w-3 h-3" /> {milestone.recipientEmails.length} selecionado{milestone.recipientEmails.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs" style={{ color: milestone.issuedEmails.length > 0 ? 'var(--c-success)' : 'var(--c-faint)' }}>
              {milestone.issuedEmails.length} emitido{milestone.issuedEmails.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {pendingCount > 0 && (
            <button
              onClick={onIssue}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: turmaIconColor, color: '#fff' }}
            >
              Emitir ({pendingCount})
            </button>
          )}
          <Tooltip label="Editar marco">
            <button
              onClick={onEdit}
              aria-label="Editar marco"
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-opacity hover:opacity-80"
              style={{ color: 'var(--c-subtle)' }}
            >
              <HiPencilSquare className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
          {milestone.issuedEmails.length > 0 && (
            <Tooltip label={expanded ? 'Ocultar emitidos' : 'Ver emitidos'}>
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-label="Ver diplomas emitidos"
                className="w-7 h-7 flex items-center justify-center rounded-lg"
                style={{ color: 'var(--c-subtle)' }}
              >
                {expanded ? <HiChevronUp className="w-4 h-4" /> : <HiChevronDown className="w-4 h-4" />}
              </button>
            </Tooltip>
          )}
          {isAdmin && (
            <Tooltip label="Apagar marco">
              <button
                onClick={onDelete}
                disabled={deleting}
                aria-label="Apagar marco"
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ color: 'var(--c-faint)' }}
              >
                <HiTrash className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease }}
            className="overflow-hidden border-t"
            style={{ borderColor: 'var(--c-border)' }}
          >
            <div className="p-3 flex flex-col gap-1.5">
              {issuedLoading ? (
                <p className="text-xs" style={{ color: 'var(--c-subtle)' }}>Carregando...</p>
              ) : (
                issued.map((d) => (
                  <a
                    key={d.id}
                    href={`/diploma/${d.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 text-xs rounded-lg px-3 py-2 transition-opacity hover:opacity-80"
                    style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }}
                  >
                    {d.studentName}
                    <HiArrowTopRightOnSquare className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--c-subtle)' }} />
                  </a>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
