import QRCode from 'qrcode'

/**
 * Origem pública usada no QR/link do diploma. Um PDF já baixado tem essa URL
 * gravada pra sempre — se o domínio final mudar (ex: migrar para
 * www.catadoresdigitais.com.br/plataforma), setar NEXT_PUBLIC_SITE_URL faz os
 * PRÓXIMOS PDFs gerados apontarem pro lugar certo (PDFs já baixados não mudam).
 * Sem a env var, cai no host da própria requisição (bom o suficiente por enquanto).
 */
export function getSiteOrigin(requestOrigin: string): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || requestOrigin
}

export async function generateDiplomaQr(id: string, origin: string): Promise<string> {
  return QRCode.toDataURL(`${origin}/diploma/${id}`, { margin: 1, width: 200 })
}
