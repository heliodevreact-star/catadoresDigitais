import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAuthAny } from '@/lib/require-auth-any'
import type { DiplomaMilestone, DiplomaEmitido } from '@/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuthAny()
  if (auth instanceof Response) return auth

  const { id } = await params

  const userSnap = await adminDb.collection('users').doc(auth.uid).get()
  const email = userSnap.data()?.email as string | undefined
  if (!email) return Response.json({ earned: [], pending: [] })

  const milestonesSnap = await adminDb.collection('turmas').doc(id).collection('diplomas').get()
  const myMilestones = milestonesSnap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<DiplomaMilestone, 'id'>) }))
    .filter((m) => m.recipientEmails.includes(email))

  const emitidosSnap = await adminDb.collection('diplomasEmitidos').where('studentEmail', '==', email).get()
  const myEmitidos = emitidosSnap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<DiplomaEmitido, 'id'>) }))
    .filter((e) => e.turmaId === id)

  const earned = myEmitidos
    .map((e) => ({ id: e.id, title: e.title, description: e.description, achievedDate: e.achievedDate }))
    .sort((a, b) => b.achievedDate.localeCompare(a.achievedDate))

  const pending = myMilestones
    .filter((m) => !m.issuedEmails.includes(email))
    .map((m) => ({ milestoneId: m.id, title: m.title, description: m.description, achievedDate: m.achievedDate }))
    .sort((a, b) => a.achievedDate.localeCompare(b.achievedDate))

  return Response.json({ earned, pending })
}
