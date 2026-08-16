import Image from 'next/image'

const FOOTER_BLUE = '#003087'

export function Footer() {
  return (
    <footer
      className="mt-auto border-t px-6 py-8"
      style={{ borderColor: 'rgba(255,255,255,0.12)', background: FOOTER_BLUE }}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        <div className="flex items-end justify-center gap-10 flex-wrap">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Realização
            </p>
            <Image
              src="/ipes-logo.webp"
              alt="Instituto Ipês"
              width={120}
              height={40}
              className="object-contain"
              style={{ height: 36, width: 'auto', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }}
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <Image
              src="/fsc_negativa_chapada.png"
              alt="Caixa Econômica Federal"
              width={160}
              height={40}
              className="object-contain"
              style={{ height: 32, width: 'auto' }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Catadores Digitais · Programa de formação em tecnologia
          </p>
          <p className="text-xs font-bold text-center" style={{ color: 'rgba(255,255,255,0.85)' }}>
            © {new Date().getFullYear()} Instituto Ipês. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
