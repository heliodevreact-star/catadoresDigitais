import { NextRequest } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { requireEditor } from '@/lib/require-editor'
import { assertTurmaEditable } from '@/lib/turma-archive'
import { isValidCPF } from '@/lib/utils'
import type { DiplomaMilestone } from '@/types'

type Ctx = { params: Promise<{ id: string; milestoneId: string }> }
type RecipientInput = { email?: unknown; cpf?: unknown }

export async function POST(req: NextRequest, { params }: Ctx) {
  const auth = await requireEditor()
  if (auth instanceof Response) return auth

  const { id, milestoneId } = await params
  const body = await req.json()

  const turmaResult = await assertTurmaEditable(id, auth.role)
  if (turmaResult instanceof Response) return turmaResult
  const { turma } = turmaResult

  if (!turma.coordinatorName?.trim() || !turma.coordinatorSignature) {
    return Response.json(
      { error: 'Configure o nome e a assinatura do coordenador geral da turma antes de emitir diplomas.' },
      { status: 400 },
    )
  }

  const milestoneRef = adminDb.collection('turmas').doc(id).collection('diplomas').doc(milestoneId)
  const milestoneDoc = await milestoneRef.get()
  if (!milestoneDoc.exists) return Response.json({ error: 'Diploma não encontrado.' }, { status: 404 })
  const milestone = milestoneDoc.data() as Omit<DiplomaMilestone, 'id'>

  const recipients: RecipientInput[] = Array.isArray(body.recipients) ? body.recipients : []
  if (recipients.length === 0) {
    return Response.json({ error: 'Selecione ao menos um aluno.' }, { status: 400 })
  }

  const alreadyIssued = new Set(milestone.issuedEmails ?? [])
  const toIssue: { email: string; cpf: string }[] = []
  const skipped: { email: string; reason: string }[] = []

  for (const r of recipients) {
    const email = typeof r.email === 'string' ? r.email.trim().toLowerCase() : ''
    const cpfDigits = typeof r.cpf === 'string' ? r.cpf.replace(/\D/g, '') : ''

    if (!email) continue
    if (alreadyIssued.has(email)) {
      skipped.push({ email, reason: 'Diploma já emitido para este aluno neste marco.' })
      continue
    }
    if (!isValidCPF(cpfDigits)) {
      skipped.push({ email, reason: 'CPF inválido ou não informado.' })
      continue
    }
    toIssue.push({ email, cpf: cpfDigits })
  }

  if (toIssue.length === 0) {
    return Response.json({ issued: [], skipped }, { status: 200 })
  }

  const nameMap: Record<string, string> = {}
  const emails = toIssue.map((r) => r.email)
  for (let i = 0; i < emails.length; i += 30) {
    const chunk = emails.slice(i, i + 30)
    const snap = await adminDb.collection('users').where('email', 'in', chunk).get()
    for (const doc of snap.docs) {
      const data = doc.data()
      if (data.email) nameMap[data.email] = data.name
    }
  }

  const now = new Date().toISOString()
  const batch = adminDb.batch()
  const issued: { id: string; email: string }[] = []

  for (const r of toIssue) {
    const studentName = nameMap[r.email]
    if (!studentName) {
      skipped.push({ email: r.email, reason: 'Aluno não encontrado na turma.' })
      continue
    }
    const ref = adminDb.collection('diplomasEmitidos').doc()
    batch.set(ref, {
      turmaId: id,
      turmaName: turma.name,
      milestoneId,
      title: milestone.title,
      description: milestone.description ?? '',
      achievedDate: milestone.achievedDate,
      studentEmail: r.email,
      studentName,
      studentCpf: r.cpf,
      coordinatorName: turma.coordinatorName,
      coordinatorSignature: turma.coordinatorSignature,
      issuedBy: auth.uid,
      issuedAt: now,
    })
    issued.push({ id: ref.id, email: r.email })
  }

  if (issued.length > 0) {
    batch.update(milestoneRef, { issuedEmails: FieldValue.arrayUnion(...issued.map((i) => i.email)) })
    await batch.commit()
  }

  return Response.json({ issued, skipped })
}
