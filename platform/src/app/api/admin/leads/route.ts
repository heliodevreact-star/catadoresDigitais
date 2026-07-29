import { requireAdmin } from '@/lib/require-admin'
import { adminDb } from '@/lib/firebase-admin'
import type { Lead } from '@/types'

export async function GET() {
  const result = await requireAdmin()
  if (result instanceof Response) return result

  const snap = await adminDb.collection('leads').orderBy('createdAt', 'desc').get()
  const leads: Lead[] = snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      email: data.email,
      source: data.source,
      createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
    }
  })
  return Response.json(leads)
}
