import Image from 'next/image'
import { notFound } from 'next/navigation'
import { HiCheckBadge } from 'react-icons/hi2'
import { adminDb } from '@/lib/firebase-admin'
import { formatCPF } from '@/lib/utils'
import { parseLocalDate } from '@/lib/date-utils'
import type { DiplomaEmitido } from '@/types'

export const dynamic = 'force-dynamic'

function fmtDiplomaDate(iso: string): string {
  return parseLocalDate(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function DiplomaVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const doc = await adminDb.collection('diplomasEmitidos').doc(id).get()
  if (!doc.exists) notFound()

  const diploma = { id: doc.id, ...(doc.data() as Omit<DiplomaEmitido, 'id'>) }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border p-8 flex flex-col items-center gap-6 text-center"
        style={{ background: 'var(--c-bg-alt)', borderColor: 'var(--c-border)' }}
      >
        <div className="flex items-center gap-6">
          <Image src="/ipes-logo.webp" alt="Instituto Ipês" width={56} height={56} className="object-contain" style={{ height: 48, width: 'auto' }} />
          <Image src="/CAIXA_2cores_positiva.png" alt="Caixa Econômica Federal" width={100} height={40} className="object-contain" style={{ height: 32, width: 'auto' }} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--c-success-soft)', color: 'var(--c-success)' }}
          >
            <HiCheckBadge className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--c-success)' }}>
            Diploma verificado
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">{diploma.title}</h1>
          <p className="text-sm" style={{ color: 'var(--c-subtle)' }}>{diploma.turmaName}</p>
        </div>

        <div className="w-full flex flex-col gap-3 text-sm text-left rounded-xl border p-4" style={{ borderColor: 'var(--c-border)' }}>
          <Row label="Aluno" value={diploma.studentName} />
          <Row label="CPF" value={formatCPF(diploma.studentCpf)} />
          <Row label="Concluído em" value={fmtDiplomaDate(diploma.achievedDate)} />
          {diploma.description && <Row label="Descrição" value={diploma.description} />}
          <Row label="Coordenador(a) Geral" value={diploma.coordinatorName} />
        </div>

        <a
          href={`/api/diplomas/${diploma.id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl text-sm font-bold text-center transition-opacity hover:opacity-90"
          style={{ background: 'var(--c-accent-yellow)', color: 'var(--c-bg)' }}
        >
          Baixar PDF do diploma
        </a>
      </div>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span style={{ color: 'var(--c-faint)' }}>{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  )
}
