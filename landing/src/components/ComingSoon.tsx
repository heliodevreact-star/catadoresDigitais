import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineLockClosed,
  HiOutlineDocumentText,
  HiOutlineXCircle,
} from 'react-icons/hi2';
import { HiSparkles } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

type Turma = {
  id: string;
  titulo: string;
  periodo: 'Tarde' | 'Manhã';
  periodoIcon: string;
  horario: string;
  accent: string;
  vagas?: number;
  link?: string;
  fechada?: boolean;
};

// Turmas 3 e 4: turmas novas, sem restrição de vagas divulgada.
const turmasNovas: Turma[] = [
  {
    id: 'turma-3',
    titulo: 'Turma 3',
    periodo: 'Manhã',
    periodoIcon: '🌅',
    horario: '9h às 12h30',
    accent: '#114BF2',
    link: 'https://forms.gle/ZqQBAdB5T6FP4WNMA',
  },
  {
    id: 'turma-4',
    titulo: 'Turma 4',
    periodo: 'Tarde',
    periodoIcon: '☀️',
    horario: '15h10 às 18h40',
    accent: '#0B35B8',
    link: 'https://forms.gle/BdRLvBLF4bXJWjf79',
  },
];

type Sessao = {
  id: string;
  tipo: 'Curso' | 'Oficina';
  icon: string;
  titulo: string;
  dataLabel: string;
  mes: 'nov' | 'dez';
  dias: number[];
  periodo: 'Tarde' | 'Manhã';
  periodoIcon: string;
  horario: string;
  color: string;
  link?: string;
};

const COR_CURSO = '#114BF2';

// Cursos: pausados por enquanto (ver MOSTRAR_CURSOS abaixo) — mantidos aqui
// pra reativar fácil quando voltarem.
const cursos: Sessao[] = [
  {
    id: 'curso-manha',
    tipo: 'Curso',
    icon: '📘',
    titulo: 'Curso de Letramento Digital',
    dataLabel: '23 a 27',
    mes: 'nov',
    dias: [23, 24, 25, 26, 27],
    periodo: 'Manhã',
    periodoIcon: '🌅',
    horario: '9h40 às 12h30',
    color: COR_CURSO,
  },
  {
    id: 'curso-tarde',
    tipo: 'Curso',
    icon: '📘',
    titulo: 'Curso de Letramento Digital',
    dataLabel: '23 a 27',
    mes: 'nov',
    dias: [23, 24, 25, 26, 27],
    periodo: 'Tarde',
    periodoIcon: '☀️',
    horario: '15h10 às 18h',
    color: COR_CURSO,
  },
];

// Cursos ficam fora do ar até serem retomados.
const MOSTRAR_CURSOS = false;

// Pausa temporária (problema elétrico na sala) — resolvida, programação de volta.
// Deixado como flag (em vez de apagar o bloco) pra reaproveitar numa próxima pausa.
const PAUSA_TEMPORARIA = false;

const priorities = [
  {
    icon: HiOutlineUserGroup,
    title: 'Catadoras e catadores',
    desc: 'Profissionais de coleta de materiais recicláveis têm prioridade garantida nas vagas.',
    color: '#83B80D',
    textColor: 'var(--c-accent-green)',
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Famílias',
    desc: 'Familiares de catadores também fazem parte do público prioritário das formações.',
    color: '#114BF2',
    textColor: 'var(--c-accent-blue)',
  },
  {
    icon: HiOutlineMapPin,
    title: 'Moradores da Estrutural',
    desc: 'Quem vive na Cidade Estrutural e no entorno tem vaga prioritária em todas as turmas.',
    color: '#4D1BBB',
    textColor: 'var(--c-accent-violet)',
  },
];

export function ComingSoon() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { isDark } = useTheme();

  function renderTurma(t: Turma, i: number, delayBase: number, dataContexto: string) {
    const temLink = Boolean(t.link) && !t.fechada;
    const Wrapper = (temLink ? motion.a : motion.div) as typeof motion.a;
    return (
      <Wrapper
        key={t.id}
        {...(temLink
          ? {
              href: t.link,
              target: '_blank',
              rel: 'noopener noreferrer',
              'aria-label': `Inscreva-se: ${t.titulo}, ${dataContexto}, período da ${t.periodo.toLowerCase()}`,
            }
          : {})}
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.25, delay: delayBase + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
        whileHover={temLink ? { y: -6, scale: 1.03, transition: { duration: 0.12, ease: 'easeOut' } } : undefined}
        whileTap={temLink ? { scale: 0.97, transition: { duration: 0.08 } } : undefined}
        className="glass-card rounded-2xl p-6 text-center flex flex-col"
        style={{ borderColor: `${t.accent}40`, opacity: t.fechada ? 0.6 : 1 }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl"
          style={{ background: `${t.accent}15` }}
        >
          💻
        </div>

        <h4 className="font-syne font-bold text-lg text-[var(--c-text)] mb-1">
          {t.titulo}
        </h4>
        <div className="font-dm text-sm text-[var(--c-muted)] mb-4 flex items-center justify-center gap-1.5">
          <span>{t.periodoIcon}</span> {t.periodo} · {t.horario}
        </div>

        {t.vagas !== undefined && (
          <div
            className="font-syne font-bold text-xs mx-auto mb-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ background: `${t.accent}15`, color: t.accent }}
          >
            🔥 {t.vagas} vagas restantes
          </div>
        )}

        {t.fechada ? (
          <div className="mt-auto font-syne font-bold text-sm px-4 py-3 rounded-xl flex items-center justify-center gap-2 border-2 border-dashed border-[var(--c-border)] text-[var(--c-subtle)]">
            <HiOutlineXCircle className="w-4 h-4" /> Turma cheia
          </div>
        ) : temLink ? (
          <div
            className="mt-auto font-syne font-bold text-sm text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: t.accent }}
          >
            Inscreva-se <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
          </div>
        ) : (
          <div
            className="mt-auto font-syne font-bold text-sm px-4 py-3 rounded-xl flex items-center justify-center gap-2 border-2 border-dashed"
            style={{ borderColor: `${t.accent}50`, color: t.accent }}
          >
            <HiOutlineDocumentText className="w-4 h-4" /> Formulário em breve
          </div>
        )}
      </Wrapper>
    );
  }

  return (
    <section id="inscricoes" className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, #06030F, #0A2015, #06030F)'
            : 'linear-gradient(to bottom, #F0F6FF, #F3FBE8, #F0F6FF)',
        }}
      />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      {/* Decorative rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-brand-green/5 pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-brand-blue/5 pointer-events-none" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6">
        {PAUSA_TEMPORARIA && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-green text-dark-950">
                <span>🚧</span>
                <span className="font-syne font-bold text-sm tracking-wide uppercase">pausa técnica</span>
              </div>
            </div>

            <h2 className="font-syne font-extrabold text-4xl md:text-5xl lg:text-6xl text-[var(--c-text)] text-center mb-6 leading-tight">
              Voltamos <span className="text-[var(--c-accent-blue)]">já, já!</span>
            </h2>

            <p className="font-dm text-lg md:text-xl text-[var(--c-muted)] text-center max-w-2xl mx-auto mb-14 leading-relaxed">
              Identificamos um problema na parte elétrica da sala e vamos fazer uma
              pequena obra pra garantir que os computadores funcionem direitinho.
              Por isso, pausamos as inscrições por um tempinho — mas as vagas das
              oficinas e dos cursos continuam garantidas. Fique de olho, voltamos logo!
            </p>
          </motion.div>
        )}

        {!PAUSA_TEMPORARIA && (
        <>
        {/* Coming soon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-green text-dark-950">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
              <HiSparkles className="w-4 h-4" />
            </motion.div>
            <span className="font-syne font-bold text-sm tracking-wide uppercase">turmas confirmadas</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
          className="font-syne font-extrabold text-4xl md:text-5xl lg:text-6xl text-[var(--c-text)] text-center mb-6 leading-tight"
        >
          Oficinas de letramento digital{' '}
          <span className="text-[var(--c-accent-blue)]">já têm data!</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-dm text-lg md:text-xl text-[var(--c-muted)] text-center max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A próxima data é 1 de dezembro, com duas turmas: Turma 3 de manhã e
          Turma 4 à tarde. Escolha a sua e inscreva-se abaixo!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-14"
        >
          <a
            href="https://maps.app.goo.gl/3M9MD3f1if5391Gy9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--c-input-bg)] border border-[var(--c-border)] font-dm text-sm text-[var(--c-text)] hover:border-brand-blue/50 transition-colors"
          >
            📍 As aulas acontecem no <strong className="font-syne">CENTCOOP</strong> — ver no mapa
            <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Turmas 3 e 4 */}
        <h3 className="font-syne font-bold text-xl md:text-2xl text-[var(--c-text)] text-center mb-1">
          📅 1 de dezembro
        </h3>
        <p className="font-dm text-sm text-[var(--c-subtle)] text-center mb-5">
          Turma 3 (manhã) e Turma 4 (tarde)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-14">
          {turmasNovas.map((t, i) => renderTurma(t, i, 0.28, 'dia 1 de dezembro'))}
        </div>

        {MOSTRAR_CURSOS && (
          <>
            {/* Cursos */}
            <h3 className="font-syne font-bold text-sm tracking-wide uppercase text-[var(--c-subtle)] text-center mb-1">
              📘 Cursos — semana de 23 a 27
            </h3>
            <p className="font-dm text-sm text-[var(--c-subtle)] text-center mb-5">
              🔒 Inscrições ainda fechadas — abrem nas oficinas ou a partir do dia 20.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-14"
            >
              {cursos.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.65 + i * 0.08 }}
                  className="glass-card rounded-2xl p-6 text-center flex flex-col"
                  style={{ borderColor: `${s.color}30` }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
                    style={{ background: `${s.color}15` }}
                  >
                    {s.icon}
                  </div>
                  <span className="font-syne font-bold text-xs tracking-wide uppercase mb-1" style={{ color: s.color }}>
                    {s.tipo}
                  </span>
                  <h4 className="font-syne font-bold text-base text-[var(--c-text)] mb-3 leading-snug">
                    {s.titulo}
                  </h4>
                  <div className="font-syne font-extrabold text-3xl text-[var(--c-text)] mb-1">
                    {s.dataLabel}
                  </div>
                  <div className="font-dm text-xs text-[var(--c-subtle)] mb-4">{s.mes.toUpperCase()}</div>
                  <div className="font-dm text-sm text-[var(--c-muted)] mb-1 flex items-center justify-center gap-1.5">
                    <span>{s.periodoIcon}</span> {s.periodo}
                  </div>
                  <div className="font-dm text-xs text-[var(--c-subtle)] mb-5">{s.horario}</div>
                  <div
                    className="mt-auto font-dm text-xs px-4 py-3 rounded-xl flex flex-col items-center justify-center gap-1 border-2 border-dashed leading-snug"
                    style={{ borderColor: `${s.color}50`, color: 'var(--c-muted)' }}
                  >
                    <span className="flex items-center gap-1.5 font-syne font-bold text-sm" style={{ color: s.color }}>
                      <HiOutlineLockClosed className="w-4 h-4" /> Inscrições em breve
                    </span>
                    nas oficinas ou a partir de 20/11
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
        </>
        )}

        {/* Priority cards */}
        <h3 className="font-syne font-bold text-xl md:text-2xl text-[var(--c-text)] text-center mb-3">
          🎯 Prioridade garantida
        </h3>
        <p className="font-dm text-base text-[var(--c-muted)] text-center max-w-2xl mx-auto mb-8">
          As vagas são abertas a toda a comunidade. Esses grupos têm prioridade garantida nas turmas:
        </p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14"
        >
          {priorities.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
                style={{ borderColor: `${p.color}20` }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${p.color}12` }}
                >
                  <Icon className="w-6 h-6" style={{ color: p.color }} />
                </div>
                <h3 className="font-syne font-bold text-lg mb-2" style={{ color: p.textColor }}>
                  {p.title}
                </h3>
                <p className="font-dm text-sm text-[var(--c-muted)] leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
