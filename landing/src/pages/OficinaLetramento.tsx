import { Link } from 'react-router-dom';

// Página temporária — conteúdo definitivo será adicionado em breve.
export function OficinaLetramento() {
  return (
    <main>
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 min-h-[70vh] flex items-center">
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h1 className="font-syne font-extrabold text-4xl md:text-5xl text-[var(--c-text)] mb-6 leading-tight">
            Oficina de Letramento Digital
          </h1>
          <p className="font-dm text-lg text-[var(--c-muted)] mb-10">
            Página em construção. Em breve, novidades por aqui!
          </p>
          <Link
            to="/oficinaletramento/jogo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-syne font-bold text-white bg-brand-blue hover:opacity-90 transition-opacity"
          >
            Ir para o jogo
          </Link>
        </div>
      </section>
    </main>
  );
}
