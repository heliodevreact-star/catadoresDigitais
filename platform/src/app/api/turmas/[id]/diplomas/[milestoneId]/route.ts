import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireEditor } from '@/lib/require-editor'
import { requireAdmin } from '@/lib/require-admin'
import { requireAuthAny } from '@/lib/require-auth-any'
import { assertTurmaEditable } from '@/lib/turma-archive'

type Ctx = { params: Promise<{ id: string; milestoneId: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const auth = await requireAuthAny()
  if (auth instanceof Response) return auth

  const { id, milestoneId } = await params
  const doc = await adminDb.collection('turmas').doc(id).collection('diplomas').doc(milestoneId).get()
  if (!doc.exists) return Response.json({ error: 'Diploma não encontrado.' }, { status: 404 })

  return Response.json({ id: doc.id, ...doc.data() })
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const auth = await requireEditor()
  if (auth instanceof Response) return auth

  const { id, milestoneId } = await params
  const body = await req.json()

  const turmaResult = await assertTurmaEditable(id, auth.role)
  if (turmaResult instanceof Response) return turmaResult

  const ref = adminDb.collection('turmas').doc(id).collection('diplomas').doc(milestoneId)
  const doc = await ref.get()
  if (!doc.exists) return Response.json({ error: 'Diploma não encontrado.' }, { status: 404 })

  if (body.achievedDate) {
    const { startDate, endDate } = turmaResult.turma
    if (body.achievedDate < startDate || body.achievedDate > endDate) {
      return Response.json({ error: 'Data fora do período da turma.' }, { status: 400 })
    }
  }

  const allowed = ['title', 'description', 'achievedDate', 'recipientEmails']
  const update: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) update[key] = body[key]
  }

  await ref.update(update)
  return Response.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  const { id, milestoneId } = await params
  await adminDb.collection('turmas').doc(id).collection('diplomas').doc(milestoneId).delete()
  return Response.json({ ok: true })
}
