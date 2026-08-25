import { useState } from 'react';

function getContrastColor(hex: string): string {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#252525' : '#FAFAFA';
}

const primaryColors = [
  { name: 'Azul principal', hex: '#174FE8', usage: 'Marca, títulos, fundos' },
  { name: 'Verde principal', hex: '#79BD0B', usage: 'Marca, destaque' },
];

const neutralColors = [
  { name: 'Grafite', hex: '#252525', usage: 'Texto, fundo' },
  { name: 'Off-white', hex: '#FAFAFA', usage: 'Fundo' },
  { name: 'Lime claro', hex: '#D5F77A', usage: 'Fundos, áreas de apoio' },
];

const accentColors = [
  { name: 'Coral', hex: '#F26B5B', usage: 'Destaque humano, chamadas' },
  { name: 'Amarelo', hex: '#F5C84C', usage: 'Energia, informação' },
  { name: 'Lilás', hex: '#8C7CF2', usage: 'Conteúdo digital, inovação' },
  { name: 'Azul céu', hex: '#62C9D8', usage: 'Tecnologia, educação' },
];

const weights = [
  { name: 'Light', value: 300, className: 'font-light', use: 'Textos longos e legendas discretas' },
  { name: 'Medium', value: 500, className: 'font-medium', use: 'Corpo de texto padrão' },
  { name: 'SemiBold', value: 600, className: 'font-semibold', use: 'Subtítulos e destaques de texto' },
  { name: 'Bold', value: 700, className: 'font-bold', use: 'Títulos, botões, chamadas' },
  { name: 'Black', value: 900, className: 'font-black', use: 'Headlines de forte impacto' },
];

const secondaryWeights = [
  { name: 'SemiBold', value: 600, className: 'font-semibold', use: 'Subtítulos e etiquetas grandes' },
  { name: 'Bold', value: 700, className: 'font-bold', use: 'Manchetes e frases de impacto' },
  { name: 'ExtraBold', value: 800, className: 'font-extrabold', use: 'Títulos hero — máximo impacto' },
];

interface PairingCard {
  bg: string;
  kicker: string;
  kickerColor: string;
  title: string;
  titleColor: string;
  body: string;
  bodyColor: string;
}

const pairingCards: PairingCard[] = [
  {
    bg: '#FAFAFA',
    kicker: 'CATADORES DIGITAIS',
    kickerColor: '#79BD0B',
    title: 'Tecnologia que transforma',
    titleColor: '#174FE8',
    body: 'Formações gratuitas em tecnologia para catadores, suas famílias e moradores da Cidade Estrutural — DF.',
    bodyColor: '#252525',
  },
  {
    bg: '#252525',
    kicker: 'CATADORES DIGITAIS',
    kickerColor: '#D5F77A',
    title: 'Do código à publicação',
    titleColor: '#FAFAFA',
    body: 'Turmas guiadas do primeiro clique até o projeto no ar, com quem já viveu isso na prática.',
    bodyColor: '#FAFAFA',
  },
  {
    bg: '#D5F77A',
    kicker: 'CATADORES DIGITAIS',
    kickerColor: '#174FE8',
    title: 'Aprender na prática',
    titleColor: '#252525',
    body: 'Games, desenvolvimento web e marketing digital — trilhas com professores que vivem do ofício.',
    bodyColor: '#252525',
  },
  {
    bg: '#174FE8',
    kicker: 'CATADORES DIGITAIS',
    kickerColor: '#D5F77A',
    title: 'Trajetórias em movimento',
    titleColor: '#FAFAFA',
    body: 'Cada turma formada é gente com uma nova porta de entrada pro mercado de tecnologia.',
    bodyColor: '#FAFAFA',
  },
  {
    bg: '#62C9D8',
    kicker: 'CATADORES DIGITAIS',
    kickerColor: '#174FE8',
    title: 'Educação é o caminho',
    titleColor: '#252525',
    body: 'Tecnologia e educação lado a lado, pensadas por quem constrói a cidade todos os dias.',
    bodyColor: '#252525',
  },
  {
    bg: '#F26B5B',
    kicker: 'CATADORES DIGITAIS',
    kickerColor: '#FAFAFA',
    title: 'Gente que transforma gente',
    titleColor: '#FAFAFA',
    body: 'Um projeto feito por quem entende a Cidade Estrutural — pra quem vive nela.',
    bodyColor: '#FAFAFA',
  },
];

const phraseCards = [
  { hex: '#174FE8', label: 'Azul principal', phrase: 'Tecnologia que transforma' },
  { hex: '#79BD0B', label: 'Verde principal', phrase: 'Trajetórias em movimento' },
  { hex: '#D5F77A', label: 'Lime claro', phrase: 'Aprender na prática' },
  { hex: '#252525', label: 'Grafite', phrase: 'Do código à publicação' },
  { hex: '#F26B5B', label: 'Coral', phrase: 'Gente que transforma gente' },
  { hex: '#F5C84C', label: 'Amarelo', phrase: 'Energia pra recomeçar' },
  { hex: '#8C7CF2', label: 'Lilás', phrase: 'Criatividade sem limite' },
  { hex: '#62C9D8', label: 'Azul céu', phrase: 'Educação é o caminho' },
  { hex: '#FAFAFA', label: 'Off-white', phrase: 'Cidade Estrutural, DF' },
];

interface Combo {
  title: string;
  mode: 'light' | 'dark';
  description: string;
  bg: string;
  primary: string;
  primaryRole: string;
  accent?: string;
  text?: string;
}

const primaryCombos: Combo[] = [
  {
    title: 'Azul sobre Off-white',
    mode: 'light',
    description: 'Aplicação padrão em fundos claros — institucional e limpo.',
    bg: '#FAFAFA',
    primary: '#174FE8',
    primaryRole: 'Marca / Título',
    text: '#252525',
  },
  {
    title: 'Azul sobre Grafite',
    mode: 'dark',
    description: 'Versão escura da marca — bom contraste para vídeo e stories.',
    bg: '#252525',
    primary: '#174FE8',
    primaryRole: 'Marca / Destaque',
    text: '#FAFAFA',
  },
  {
    title: 'Verde sobre Off-white',
    mode: 'light',
    description: 'Destaque em fundo claro — bom para CTAs e chamadas.',
    bg: '#FAFAFA',
    primary: '#79BD0B',
    primaryRole: 'Marca / Destaque',
    text: '#252525',
  },
  {
    title: 'Verde sobre Grafite',
    mode: 'dark',
    description: 'Destaque vibrante em fundo escuro — ótimo para reels.',
    bg: '#252525',
    primary: '#79BD0B',
    primaryRole: 'Marca / Destaque',
    text: '#FAFAFA',
  },
  {
    title: 'Azul + Verde',
    mode: 'light',
    description: 'As duas cores da marca juntas — peças institucionais completas.',
    bg: '#FAFAFA',
    primary: '#174FE8',
    primaryRole: 'Título',
    accent: '#79BD0B',
    text: '#252525',
  },
  {
    title: 'Azul + Verde',
    mode: 'dark',
    description: 'Combinação de marca em fundo escuro — alto impacto.',
    bg: '#252525',
    primary: '#174FE8',
    primaryRole: 'Título',
    accent: '#79BD0B',
    text: '#FAFAFA',
  },
];

const secondaryCombos: Combo[] = [
  {
    title: 'Azul + Lime claro',
    mode: 'light',
    description: 'Fundo de apoio suave — conteúdos leves e educativos.',
    bg: '#D5F77A',
    primary: '#174FE8',
    primaryRole: 'Marca',
    text: '#252525',
  },
  {
    title: 'Verde + Lilás',
    mode: 'light',
    description: 'Marca + conteúdo digital — posts sobre tecnologia e inovação.',
    bg: '#FAFAFA',
    primary: '#79BD0B',
    primaryRole: 'Marca',
    accent: '#8C7CF2',
    text: '#252525',
  },
  {
    title: 'Azul + Coral',
    mode: 'light',
    description: 'Marca + chamada humana — depoimentos e convites diretos.',
    bg: '#FAFAFA',
    primary: '#174FE8',
    primaryRole: 'Marca',
    accent: '#F26B5B',
    text: '#252525',
  },
  {
    title: 'Verde + Amarelo',
    mode: 'light',
    description: 'Energia e informação — avisos, novidades e datas importantes.',
    bg: '#FAFAFA',
    primary: '#79BD0B',
    primaryRole: 'Marca',
    accent: '#F5C84C',
    text: '#252525',
  },
  {
    title: 'Azul + Azul céu',
    mode: 'light',
    description: 'Marca + tecnologia — conteúdos sobre cursos e educação digital.',
    bg: '#FAFAFA',
    primary: '#174FE8',
    primaryRole: 'Marca',
    accent: '#62C9D8',
    text: '#252525',
  },
  {
    title: 'Grafite + Coral + Amarelo',
    mode: 'dark',
    description: 'Fundo escuro com dois acentos quentes — peças de forte energia.',
    bg: '#252525',
    primary: '#F26B5B',
    primaryRole: 'Destaque 1',
    accent: '#F5C84C',
    text: '#FAFAFA',
  },
];

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="font-inter font-bold text-xs tracking-widest uppercase text-[#174FE8] mb-2">{kicker}</p>
      <h2 className="font-inter font-black text-3xl md:text-4xl text-[#252525]">{title}</h2>
    </div>
  );
}

function ColorSwatch({ name, hex, usage }: { name: string; hex: string; usage: string }) {
  const [copied, setCopied] = useState(false);
  const textColor = getContrastColor(hex);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponível — sem feedback, sem quebra
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="group text-left rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div style={{ background: hex, color: textColor }} className="h-24 flex items-end p-4">
        <span className="font-inter font-semibold text-xs">
          {copied ? 'Copiado!' : hex}
        </span>
      </div>
      <div className="p-4 bg-white">
        <p className="font-inter font-bold text-sm text-[#252525]">{name}</p>
        <p className="font-inter text-xs text-[#252525]/60 mt-1">{usage}</p>
      </div>
    </button>
  );
}

function SwatchChip({ hex, role }: { hex: string; role: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard indisponível — sem feedback, sem quebra
    }
  }

  return (
    <button onClick={handleCopy} className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0" style={{ background: hex }} />
      <span className="font-inter text-xs text-[#252525]">
        <span className="font-mono font-semibold">{copied ? 'Copiado!' : hex}</span>
        <span className="text-[#252525]/50"> · {role}</span>
      </span>
    </button>
  );
}

function ComboCard({ combo }: { combo: Combo }) {
  const bodyText = combo.text ?? getContrastColor(combo.bg);
  const swatches = [
    { hex: combo.bg, role: 'Fundo' },
    { hex: combo.primary, role: combo.primaryRole },
    ...(combo.accent ? [{ hex: combo.accent, role: 'Destaque' }] : []),
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-black/5 shadow-sm">
      <div style={{ background: combo.bg }} className="p-6 min-h-[150px] flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <span
            style={{ color: bodyText }}
            className="font-inter font-semibold text-[10px] uppercase tracking-widest opacity-50"
          >
            {combo.mode === 'dark' ? 'Aplicação dark' : 'Aplicação light'}
          </span>
        </div>
        <div>
          <p style={{ color: combo.primary }} className="font-inter font-black text-2xl leading-none mb-3">
            CATADORES DIGITAIS
          </p>
          {combo.accent && (
            <span
              style={{ background: combo.accent, color: getContrastColor(combo.accent) }}
              className="inline-block font-inter font-semibold text-xs px-3 py-1.5 rounded-full"
            >
              Saiba mais
            </span>
          )}
        </div>
      </div>
      <div className="p-4 bg-white flex flex-col gap-2">
        <p className="font-inter font-bold text-sm text-[#252525] mb-1">{combo.title}</p>
        <p className="font-inter text-xs text-[#252525]/60 mb-2 leading-relaxed">{combo.description}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {swatches.map((s) => (
            <SwatchChip key={s.role} hex={s.hex} role={s.role} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PairingCard({ card }: { card: PairingCard }) {
  return (
    <div
      style={{ background: card.bg }}
      className="rounded-2xl overflow-hidden border border-black/5 shadow-sm p-7 flex flex-col gap-4 min-h-[220px]"
    >
      <span style={{ color: card.kickerColor }} className="font-inter font-bold text-[10px] tracking-widest uppercase">
        {card.kicker}
      </span>
      <p style={{ color: card.titleColor }} className="font-syne font-extrabold text-3xl md:text-4xl leading-[0.95]">
        {card.title}
      </p>
      <p style={{ color: card.bodyColor }} className="font-inter font-light text-sm leading-relaxed opacity-80">
        {card.body}
      </p>
    </div>
  );
}

function PhraseCard({ hex, label, phrase }: { hex: string; label: string; phrase: string }) {
  const textColor = getContrastColor(hex);
  return (
    <div
      style={{ background: hex }}
      className="rounded-2xl border border-black/5 shadow-sm p-7 min-h-[190px] flex flex-col justify-between"
    >
      <span style={{ color: textColor }} className="font-inter font-semibold text-[10px] uppercase tracking-widest opacity-50">
        {label}
      </span>
      <p style={{ color: textColor }} className="font-syne font-extrabold text-3xl leading-[0.95]">
        {phrase}
      </p>
    </div>
  );
}

export function Design() {
  return (
    <div className="min-h-screen font-inter" style={{ background: '#FAFAFA' }}>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <span
            className="inline-block font-inter font-semibold text-xs tracking-widest uppercase px-3 py-1 rounded-full mb-6"
            style={{ background: '#174FE81A', color: '#174FE8' }}
          >
            Uso interno · Redes sociais
          </span>
          <h1 className="font-inter font-black text-4xl md:text-6xl leading-[1.05] text-[#252525] mb-5">
            Design System
            <br />
            CATADORES DIGITAIS
          </h1>
          <p className="font-inter font-light text-lg text-[#252525]/70 max-w-2xl leading-relaxed">
            Guia rápido de cores e tipografia para quem cuida das redes sociais e das peças de
            comunicação do projeto. Clique em qualquer cor para copiar o código hexadecimal.
          </p>
        </div>
      </section>

      {/* Cores */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <SectionHeading kicker="Paleta" title="Cores da marca" />

          <p className="font-inter font-semibold text-sm text-[#252525]/70 mb-4">Principais</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {primaryColors.map((c) => (
              <ColorSwatch key={c.hex} {...c} />
            ))}
          </div>

          <p className="font-inter font-semibold text-sm text-[#252525]/70 mb-4">Neutras</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {neutralColors.map((c) => (
              <ColorSwatch key={c.hex} {...c} />
            ))}
          </div>

          <p className="font-inter font-semibold text-sm text-[#252525]/70 mb-4">Secundárias / destaque</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {accentColors.map((c) => (
              <ColorSwatch key={c.hex} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* Tipografia */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <SectionHeading kicker="Tipografia" title="Fonte Inter" />

          <div className="rounded-2xl overflow-hidden border border-black/5 bg-white">
            {weights.map((w, i) => (
              <div
                key={w.value}
                className={`px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                  i !== weights.length - 1 ? 'border-b border-black/5' : ''
                }`}
              >
                <p className={`font-inter ${w.className} text-3xl md:text-4xl text-[#252525]`}>
                  CATADORES DIGITAIS
                </p>
                <div className="md:text-right shrink-0">
                  <p className="font-inter font-bold text-sm text-[#174FE8]">
                    {w.name} · {w.value}
                  </p>
                  <p className="font-inter text-xs text-[#252525]/60 mt-1">{w.use}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-black/5 bg-white px-6 py-5">
            <p className="font-inter text-sm text-[#252525]/70 leading-relaxed">
              <span className="font-semibold text-[#252525]">No Canva, Figma ou Google Slides:</span> procure
              por <span className="font-mono">Inter</span> na lista de fontes do Google Fonts e selecione o
              peso desejado (300, 500, 600, 700 ou 900).
            </p>
          </div>
        </div>
      </section>

      {/* Fonte secundária */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <SectionHeading kicker="Tipografia" title="Fonte secundária" />

          <p className="font-inter font-light text-base text-[#252525]/70 max-w-2xl mb-8 leading-relaxed">
            A <span className="font-semibold text-[#252525]">Barlow Condensed</span> é a fonte de destaque já
            usada nos títulos grandes do site (o Hero da landing) — mantém a identidade e forma um bom par com
            a Inter: condensada e cheia de presença nas manchetes, enquanto a Inter cuida do texto corrido e da
            interface. Nunca as duas em texto corrido — Barlow Condensed é só para títulos e frases curtas.
          </p>

          <div className="rounded-2xl overflow-hidden border border-black/5 bg-white">
            {secondaryWeights.map((w, i) => (
              <div
                key={w.value}
                className={`px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                  i !== secondaryWeights.length - 1 ? 'border-b border-black/5' : ''
                }`}
              >
                <p className={`font-syne ${w.className} text-4xl md:text-5xl text-[#252525] leading-none`}>
                  CATADORES DIGITAIS
                </p>
                <div className="md:text-right shrink-0">
                  <p className="font-inter font-bold text-sm text-[#174FE8]">
                    {w.name} · {w.value}
                  </p>
                  <p className="font-inter text-xs text-[#252525]/60 mt-1">{w.use}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-black/5 bg-white px-6 py-5">
            <p className="font-inter text-sm text-[#252525]/70 leading-relaxed">
              <span className="font-semibold text-[#252525]">Como usar:</span> Barlow Condensed para títulos,
              manchetes e frases de impacto; Inter para textos, legendas e botões. Quer uma opção ainda mais
              enfeitada pra peças pontuais? Uma serifada como <span className="font-mono">Fraunces</span> também
              combina bem com a Inter, se quiser variar em alguma peça especial.
            </p>
          </div>

          <p className="font-inter font-semibold text-sm text-[#252525]/70 mt-14 mb-4">
            Pareamento — título + texto
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {pairingCards.map((card) => (
              <PairingCard key={card.title} card={card} />
            ))}
          </div>

          <p className="font-inter font-semibold text-sm text-[#252525]/70 mb-4">
            Frases em destaque — variedade de cores
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {phraseCards.map((p) => (
              <PhraseCard key={p.hex} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* Combinações */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <SectionHeading kicker="Aplicações" title="Combinações de cores" />

          <p className="font-inter font-semibold text-sm text-[#252525]/70 mb-4">
            Cores principais — light &amp; dark
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {primaryCombos.map((combo) => (
              <ComboCard key={combo.title + combo.mode} combo={combo} />
            ))}
          </div>

          <p className="font-inter font-semibold text-sm text-[#252525]/70 mb-4">
            Com cores secundárias
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondaryCombos.map((combo) => (
              <ComboCard key={combo.title + combo.mode} combo={combo} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
