/**
 * Redimensiona uma imagem no client antes de guardar como base64 (usado na assinatura do coordenador).
 * Exporta PNG (sem achatar num fundo) para preservar transparência — uma assinatura com fundo
 * transparente convertida pra JPEG ganha um fundo sólido e artefatos de compressão em blocos
 * (aparecem como um cinza claro ao redor do traço), então PNG é o formato certo aqui.
 */
export function resizeImageToDataUrl(
  file: File,
  { maxWidth = 400, maxHeight = 160 }: { maxWidth?: number; maxHeight?: number } = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height)
      const width = Math.round(img.width * scale)
      const height = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas não suportado.'))

      ctx.drawImage(img, 0, 0, width, height)

      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Não foi possível ler a imagem.'))
    }
    img.src = objectUrl
  })
}
