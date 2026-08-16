import { NextRequest } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { generateDiplomaQr, getSiteOrigin } from '@/lib/diploma-qr'
import { renderDiplomaPdf } from '@/lib/diploma-pdf'
import type { DiplomaEmitido } from '@/types'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const doc = await adminDb.collection('diplomasEmitidos').doc(id).get()
  if (!doc.exists) return Response.json({ error: 'Diploma não encontrado.' }, { status: 404 })

  const diploma = { id: doc.id, ...(doc.data() as Omit<DiplomaEmitido, 'id'>) }
  const origin = getSiteOrigin(new URL(req.url).origin)

  try {
    const qrDataUrl = await generateDiplomaQr(diploma.id, origin)
    const buffer = await renderDiplomaPdf(diploma, qrDataUrl)

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="diploma-${diploma.studentName.replace(/\s+/g, '-').toLowerCase()}.pdf"`,
      },
    })
  } catch (err) {
    console.error('[GET diploma pdf]', err)
    return Response.json({ error: 'Erro ao gerar o PDF do diploma.' }, { status: 500 })
  }
}
