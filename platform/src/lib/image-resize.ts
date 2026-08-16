/** Redimensiona/comprime uma imagem no client antes de guardar como base64 (usado na assinatura do coordenador). */
export function resizeImageToDataUrl(
  file: File,
  { maxWidth = 400, maxHeight = 160, quality = 0.85 }: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
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

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Não foi possível ler a imagem.'))
    }
    img.src = objectUrl
  })
}
