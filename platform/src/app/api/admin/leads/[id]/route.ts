import { requireAdmin } from '@/lib/require-admin'
import { adminDb } from '@/lib/firebase-admin'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await requireAdmin()
  if (result instanceof Response) return result

  const { id } = await params
  await adminDb.collection('leads').doc(id).delete()
  return Response.json({ ok: true })
}
