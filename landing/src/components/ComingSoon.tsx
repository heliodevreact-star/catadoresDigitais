import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { HiOutlineMapPin, HiOutlineUserGroup, HiOutlineArrowTopRightOnSquare, HiOutlineClock } from 'react-icons/hi2';
import { HiSparkles } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

type Sessao = {
  id: string;
  tipo: 'Curso' | 'Oficina';
  icon: string;
  titulo: string;
  dataLabel: string;
  dias: number[];
  periodo: 'Tarde' | 'Manhã';
  periodoIcon: string;
  horario: string;
  color: string;
  link: string;
};

const sessoes: Sessao[] = [
  {
    id: 'curso-1',
    tipo: 'Curso',
    icon: '📘',
    titulo: 'Curso de Letramento Digital',
    dataLabel: '16 a 19',
    dias: [16, 17, 18, 19],
    periodo: 'Tarde',
    periodoIcon: '☀️',
    horario: '15h10 às 18h',
    color: '#114BF2',
    link: 'https://forms.gle/f69ML5n6YM53G2UAA',
  },
  {
    id: 'oficina-1',
    tipo: 'Oficina',
    icon: '⚡',
    titulo: 'Oficina de Letramento Digital',
    dataLabel: '19',
    dias: [19],
    periodo: 'Manhã',
    periodoIcon: '🌅',
    horario: '8h40 às 12h30',
    color: '#4D1BBB',
    link: 'https://forms.gle/YSCudAYeDVrDdaP38',
  },
  {
    id: 'curso-2',
    tipo: 'Curso',
    icon: '📘',
    titulo: 'Curso de Letramento Digital',
    dataLabel: '23 a 27',
    dias: [23, 24, 25, 26, 27],
    periodo: 'Manhã',
    periodoIcon: '🌅',
    horario: '9h40 às 12h30',
    color: '#83B80D',
    link: 'https://forms.gle/Vfofzr1nASUfaf898',
  },
  {
    id: 'oficina-2',
    tipo: 'Oficina',
    icon: '⚡',
    titulo: 'Oficina de Letramento Digital',
    dataLabel: '27',
    dias: [27],
    periodo: 'Tarde',
    periodoIcon: '☀️',
    horario: '13h40 às 17h30',
    color: '#4D1BBB',
    link: 'https://forms.gle/r7M1Luoj8wbTe1Ei6',
  },
];

// Novembro/2026 começa num domingo — grade usada para o mini-calendário visual.
const DIAS_SEMANA_ABREV = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const DIAS_SEMANA_NOME = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

type Celula = { dia: number; mes: 'nov' | 'dez' };
const CELULAS_CALENDARIO: Celula[] = [
  ...Array.from({ length: 30 }, (_, i) => ({ dia: i + 1, mes: 'nov' as const })),
  ...Array.from({ length: 5 }, (_, i) => ({ dia: i + 1, mes: 'dez' as const })),
];

type DiaInfo = { bg: string; color: string; emojis: string[]; tooltip: string };

function construirDiaInfo(lista: Sessao[]): Record<number, DiaInfo> {
  const mapa: Record<number, DiaInfo> = {};
  for (const s of lista) {
    for (const d of s.dias) {
      if (!mapa[d]) mapa[d] = { bg: `${s.color}20`, color: s.color, emojis: [], tooltip: '' };
      mapa[d].emojis.push(s.periodoIcon);
      const linha = `${s.periodoIcon} ${s.titulo} — ${s.periodo} (${s.horario})`;
      mapa[d].tooltip = mapa[d].tooltip ? `${mapa[d].tooltip}\n${linha}` : linha;
    }
  }
  return mapa;
}

const DIA_INFO = construirDiaInfo(sessoes);

const FERIADOS: Record<number, string> = {
  2: 'Finados',
  15: 'Proclamação da República',
  20: 'Consciência Negra',
};

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

type TooltipState = { text: string; top: number; left: number; accent: string };

export function ComingSoon() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { isDark } = useTheme();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  function showTooltip(e: React.MouseEvent<HTMLDivElement>, text: string, accent: string) {
    const cardEl = calendarRef.current;
    if (!cardEl) return;
    const cellRect = e.currentTarget.getBoundingClientRect();
    const cardRect = cardEl.getBoundingClientRect();
    setTooltip({
      text,
      top: cellRect.top - cardRect.top,
      left: cellRect.left - cardRect.left + cellRect.width / 2,
      accent,
    });
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
        {/* Coming soon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-green text-dark-950">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
              <HiSparkles className="w-4 h-4" />
            </motion.div>
            <span className="font-syne font-bold text-sm tracking-wide uppercase">inscrições</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-syne font-extrabold text-4xl md:text-5xl lg:text-6xl text-[var(--c-text)] text-center mb-6 leading-tight"
        >
          As inscrições estão{' '}
          <span className="text-[var(--c-accent-blue)]">abertas!</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-dm text-lg md:text-xl text-[var(--c-muted)] text-center max-w-2xl mx-auto mb-14 leading-relaxed"
        >
          As inscrições para os cursos de letramento digital de novembro já estão
          abertas — veja as datas e inscreva-se abaixo. Em breve, abrimos turmas de
          montagem e configuração de computadores também.
        </motion.p>

        {/* Curso x Oficina */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-center mb-3">
            <span className="flex items-center gap-2 font-dm text-sm md:text-base text-[var(--c-text)]">
              <span className="text-xl">📘</span>
              <span><strong className="font-syne">Curso:</strong> mais prática, com atendimento mais individual</span>
            </span>
            <span className="flex items-center gap-2 font-dm text-sm md:text-base text-[var(--c-text)]">
              <span className="text-xl">⚡</span>
              <span><strong className="font-syne">Oficina:</strong> tudo em 1 dia, de um jeito mais dinâmico</span>
            </span>
          </div>
          <p className="font-dm text-sm text-[var(--c-subtle)] text-center max-w-xl mx-auto mb-5">
            Os dois têm professor e ensinam o mesmo conteúdo — escolha o que encaixa melhor na sua rotina.
          </p>

          <div className="flex justify-center">
            <a
              href="https://maps.app.goo.gl/3M9MD3f1if5391Gy9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--c-input-bg)] border border-[var(--c-border)] font-dm text-sm text-[var(--c-text)] hover:border-brand-blue/50 transition-colors"
            >
              📍 As aulas acontecem no <strong className="font-syne">CENTCOOP</strong> — ver no mapa
              <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {/* Cards de inscrição */}
        <h3 className="font-syne font-bold text-sm tracking-wide uppercase text-[var(--c-subtle)] text-center mb-5">
          👇 Escolha sua turma
        </h3>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14"
        >
          {sessoes.map((s, i) => (
            <motion.a
              key={s.id}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Inscreva-se: ${s.titulo}, ${s.dataLabel} de novembro, período da ${s.periodo.toLowerCase()}`}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
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
              <div className="font-dm text-xs text-[var(--c-subtle)] mb-4">NOV</div>
              <div className="font-dm text-sm text-[var(--c-muted)] mb-1 flex items-center justify-center gap-1.5">
                <span>{s.periodoIcon}</span> {s.periodo}
              </div>
              <div className="font-dm text-xs text-[var(--c-subtle)] mb-5">{s.horario}</div>
              <div
                className="mt-auto font-syne font-bold text-sm text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: s.color }}
              >
                Inscreva-se <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Mini-calendário visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="glass-card rounded-3xl p-6 md:p-8 mb-14"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h3 className="font-syne font-extrabold text-xl md:text-2xl text-[var(--c-text)]">
              🗓️ Novembro
            </h3>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--c-input-bg)] border border-[var(--c-border)]">
              <HiOutlineClock className="w-4 h-4 text-[var(--c-subtle)]" />
              <span className="font-dm text-xs text-[var(--c-subtle)]">
                ⏰ Confira o horário de cada turma abaixo
              </span>
            </div>
          </div>

          <div ref={calendarRef} className="relative">
            <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] mb-6">
              <div className="grid grid-cols-7 bg-[var(--c-input-bg)]">
                {DIAS_SEMANA_NOME.map((nome, i) => (
                  <div
                    key={i}
                    className="text-center font-syne font-bold text-[10px] sm:text-sm text-[var(--c-subtle)] py-2 px-0.5 truncate"
                  >
                    <span className="hidden sm:inline">{nome}</span>
                    <span className="sm:hidden">{DIAS_SEMANA_ABREV[i]}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 divide-x divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
                {CELULAS_CALENDARIO.map((cel, i) => {
                  const isDez = cel.mes === 'dez';
                  const info = !isDez ? DIA_INFO[cel.dia] : undefined;
                  const feriado = !isDez ? FERIADOS[cel.dia] : undefined;
                  const texto = isDez
                    ? 'Muito em breve...'
                    : (info?.tooltip ?? (feriado ? `🎉 Feriado — ${feriado}` : undefined));
                  const accent = info?.color ?? (feriado ? '#4D1BBB' : 'var(--c-subtle)');
                  return (
                    <div
                      key={i}
                      className="aspect-square flex flex-col items-center justify-center gap-0.5"
                      style={{ background: info?.bg ?? 'transparent', opacity: isDez ? 0.35 : 1 }}
                      onMouseEnter={texto ? (e) => showTooltip(e, texto, accent) : undefined}
                      onMouseLeave={texto ? () => setTooltip(null) : undefined}
                    >
                      <span
                        className="font-dm text-xs sm:text-sm leading-none"
                        style={{
                          color: info ? 'var(--c-text)' : feriado || isDez ? 'var(--c-subtle)' : 'var(--c-muted)',
                          fontWeight: info ? 700 : 400,
                        }}
                      >
                        {cel.dia}
                      </span>
                      {info && (
                        <span className="text-[9px] sm:text-xs leading-none">{info.emojis.join(' ')}</span>
                      )}
                      {!info && feriado && <span className="text-[9px] sm:text-xs leading-none">🎉</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {tooltip && (
              <div
                className="absolute z-50 pointer-events-none px-3 py-2 rounded-lg shadow-lg text-xs font-dm leading-snug whitespace-pre-line text-left text-white"
                style={{
                  top: tooltip.top,
                  left: tooltip.left,
                  transform: 'translate(-50%, calc(-100% - 10px))',
                  background: '#17122B',
                  borderLeft: `3px solid ${tooltip.accent}`,
                  maxWidth: 220,
                }}
              >
                {tooltip.text}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center font-dm text-xs sm:text-sm text-[var(--c-muted)] mb-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: '#114BF2' }} /> ☀️ Curso — tarde (15h10–18h)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: '#83B80D' }} /> 🌅 Curso — manhã (9h40–12h30)
            </span>
            <span className="flex items-center gap-1.5">⚡ Oficina (mesmo conteúdo, só 1 dia): manhã 8h40–12h30 ou tarde 13h40–17h30</span>
            <span className="flex items-center gap-1.5">🎉 Feriado (sem aula)</span>
          </div>
          <p className="font-dm text-xs text-[var(--c-subtle)] text-center">
            Feriados de novembro: dia 2 (Finados), 15 (Proclamação da República) e 20 (Consciência Negra).
          </p>
        </motion.div>

        {/* Priority cards */}
        <h3 className="font-syne font-bold text-xl md:text-2xl text-[var(--c-text)] text-center mb-3">
          🎯 Prioridade garantida
        </h3>
        <p className="font-dm text-base text-[var(--c-muted)] text-center max-w-2xl mx-auto mb-8">
          As inscrições estão abertas pra toda a comunidade. Esses grupos têm vaga garantida nas turmas:
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
