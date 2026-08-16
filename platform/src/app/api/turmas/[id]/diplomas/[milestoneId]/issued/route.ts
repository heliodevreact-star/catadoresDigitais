import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireEditor } from '@/lib/require-editor'
import type { DiplomaEmitido } from '@/types'

type Ctx = { params: Promise<{ id: string; milestoneId: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const auth = await requireEditor()
  if (auth instanceof Response) return auth

  const { milestoneId } = await params

  // milestoneId sozinho já é único (ID de doc do Firestore) — filtrar só por ele
  // evita depender de um índice composto (turmaId + milestoneId) que não existe
  // neste projeto (sem firebase.json/deploy de índices automatizado).
  const snap = await adminDb
    .collection('diplomasEmitidos')
    .where('milestoneId', '==', milestoneId)
    .get()

  const emitidos = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<DiplomaEmitido, 'id'>) }))
    .sort((a, b) => a.studentName.localeCompare(b.studentName))

  return Response.json(emitidos)
}
