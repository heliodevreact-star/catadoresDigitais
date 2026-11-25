import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { IconType } from 'react-icons';
import {
  HiOutlineArrowRight,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineClipboardDocumentCheck,
  HiOutlineFolderOpen,
  HiOutlinePresentationChartBar,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { BsController } from 'react-icons/bs';
import { useTheme } from '../context/ThemeContext';

type Recurso = {
  id: string;
  passo: string;
  icon: IconType;
  titulo: string;
  desc: string;
  cta: string;
  href: string;
  color: string;
  textColor: string;
};

const recursos: Recurso[] = [
  {
    id: 'apresentacao',
    passo: '1',
    icon: HiOutlinePresentationChartBar,
    titulo: 'Apresentação do aluno',
    desc: 'Os slides que usamos na oficina. Acompanhe a aula ou revise o conteúdo quando quiser.',
    cta: 'Abrir apresentação',
    href: 'https://docs.google.com/presentation/d/1aol0li76MJZ0K3_HYd_qnT2xs6Hr5Suv/edit?usp=sharing&ouid=103849108207813228479&rtpof=true&sd=true',
    color: '#114BF2',
    textColor: 'var(--c-accent-blue)',
  },
  {
    id: 'documentos',
    passo: '2',
    icon: HiOutlineFolderOpen,
    titulo: 'Documentos da oficina',
    desc: 'A pasta com todos os materiais da Oficina de Letramento Digital, num lugar só.',
    cta: 'Abrir pasta',
    href: 'https://drive.google.com/drive/folders/1EzgSrZUyO4dkcAUDDLHN5PUy01CVxcb4?usp=drive_link',
    color: '#517208',
    textColor: 'var(--c-accent-green)',
  },
  {
    id: 'avaliacao',
    passo: '4',
    icon: HiOutlineClipboardDocumentCheck,
    titulo: 'Formulário de avaliação',
    desc: 'Conte pra gente como foi a oficina. Sua opinião ajuda a melhorar as próximas turmas.',
    cta: 'Avaliar a oficina',
    href: 'https://forms.gle/t8nphAYVFza56kgZ9',
    color: '#4D1BBB',
    textColor: 'var(--c-accent-violet)',
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

function RecursoCard({ r, i }: { r: Recurso; i: number }) {
  const Icon = r.icon;
  return (
    <motion.a
      href={r.href}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={i}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="glass-card group rounded-2xl p-6 flex flex-col h-full"
      style={{ borderColor: `${r.color}30` }}
    >
      <div className="flex items-center justify-between mb-5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: `${r.color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color: r.textColor }} />
        </div>
        <span className="font-syne font-bold text-xs tracking-wide uppercase text-[var(--c-subtle)]">
          Passo {r.passo}
        </span>
      </div>
      <h2 className="font-syne font-bold text-xl text-[var(--c-text)] mb-2">{r.titulo}</h2>
      <p className="font-dm text-sm text-[var(--c-muted)] leading-relaxed mb-6">{r.desc}</p>
      <span
        className="mt-auto inline-flex items-center gap-2 font-syne font-bold text-sm"
        style={{ color: r.textColor }}
      >
        {r.cta}
        <HiOutlineArrowTopRightOnSquare className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </motion.a>
  );
}

export function OficinaLetramento() {
  const { isDark } = useTheme();
  const [apresentacao, documentos, avaliacao] = recursos;

  return (
    <main>
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, #06030F, #0A1420, #06030F)'
              : 'linear-gradient(to bottom, #FFFFFF, #F2F7EC, #FFFFFF)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Cabeçalho */}
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 mb-6"
            >
              <HiOutlineSparkles className="w-4 h-4 text-[var(--c-accent-blue)]" />
              <span className="font-dm text-sm font-medium text-[var(--c-accent-blue)] tracking-wide">
                Materiais da oficina
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="font-syne font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight mb-5"
            >
              <span className="text-[var(--c-text)]">Oficina de</span>{' '}
              <span className="text-[var(--c-accent-blue)]">Letramento Digital</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-dm text-lg md:text-xl text-[var(--c-muted)] max-w-2xl mx-auto leading-relaxed"
            >
              Tudo o que você precisa pra acompanhar a oficina está aqui: os slides,
              os documentos, o jogo e a avaliação. Toque no cartão para abrir.
            </motion.p>
          </div>

          {/* Passos 1 e 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <RecursoCard r={apresentacao} i={0} />
            <RecursoCard r={documentos} i={1} />
          </div>

          {/* Passo 3: jogo em destaque */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="mb-5">
            <Link
              to="/oficinaletramento/jogo"
              className="group relative block rounded-3xl p-7 md:p-9 overflow-hidden text-white transition-transform hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #114BF2 0%, #4D1BBB 100%)' }}
            >
              <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute right-24 -bottom-16 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

              <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <BsController className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <span className="font-syne font-bold text-xs tracking-wide uppercase text-white/75">
                    Passo 3 · Jogo
                  </span>
                  <h2 className="font-syne font-extrabold text-2xl md:text-3xl mt-1 mb-2">
                    Mensagem verdadeira ou falsa?
                  </h2>
                  <p className="font-dm text-base text-white/85 leading-relaxed max-w-xl">
                    8 mensagens de celular. Em dupla, descubram quais são de verdade e quais
                    são golpe — e aprendam a reconhecer os sinais de alerta.
                  </p>
                </div>
                <span className="inline-flex items-center justify-center gap-2 font-syne font-bold text-base bg-white text-[#114BF2] px-6 py-3.5 rounded-xl shrink-0">
                  Jogar agora
                  <HiOutlineArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Passo 4 */}
          <RecursoCard r={avaliacao} i={3} />
        </div>
      </section>
    </main>
  );
}
