import QRCode from 'qrcode'

export async function generateDiplomaQr(id: string, origin: string): Promise<string> {
  return QRCode.toDataURL(`${origin}/diploma/${id}`, { margin: 1, width: 200 })
}
