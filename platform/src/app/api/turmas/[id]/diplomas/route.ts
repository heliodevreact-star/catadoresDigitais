import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireEditor } from '@/lib/require-editor'
import { requireAuthAny } from '@/lib/require-auth-any'
import { assertTurmaEditable } from '@/lib/turma-archive'
import type { DiplomaMilestone } from '@/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuthAny()
  if (auth instanceof Response) return auth

  const { id } = await params

  try {
    const snap = await adminDb
      .collection('turmas').doc(id)
      .collection('diplomas')
      .orderBy('achievedDate')
      .get()

    const milestones = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DiplomaMilestone, 'id'>) }))
    return Response.json(milestones)
  } catch (err) {
    console.error('[GET diplomas]', err)
    return Response.json({ error: 'Erro ao buscar diplomas.' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireEditor()
  if (auth instanceof Response) return auth

  const { id } = await params
  const body = await req.json()

  if (!body.title?.trim() || !body.achievedDate) {
    return Response.json({ error: 'Título e data são obrigatórios.' }, { status: 400 })
  }

  const turmaResult = await assertTurmaEditable(id, auth.role)
  if (turmaResult instanceof Response) return turmaResult

  const { startDate, endDate } = turmaResult.turma
  if (body.achievedDate < startDate || body.achievedDate > endDate) {
    return Response.json({ error: 'Data fora do período da turma.' }, { status: 400 })
  }

  const recipientEmails: string[] = Array.isArray(body.recipientEmails) ? body.recipientEmails : []

  const ref = await adminDb
    .collection('turmas').doc(id)
    .collection('diplomas')
    .add({
      title: body.title.trim(),
      description: body.description?.trim() ?? '',
      achievedDate: body.achievedDate,
      recipientEmails,
      issuedEmails: [],
      createdBy: auth.uid,
      createdAt: new Date().toISOString(),
    })

  return Response.json({ id: ref.id }, { status: 201 })
}
