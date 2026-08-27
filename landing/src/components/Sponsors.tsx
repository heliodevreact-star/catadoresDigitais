import { motion, useInView, type Variants } from 'framer-motion';
import { useRef } from 'react';
import { HiOutlineHeart } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function Sponsors() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { isDark } = useTheme();

  return (
    <section id="realizacao" className="relative py-24 md:py-28 overflow-hidden">
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, #0A2015, #0D2A1B, #0A2015)'
            : 'linear-gradient(to bottom, #F3FBE8 0%, #F0F6FF 30%, #ffffff 58%, #ffffff 100%)',
        }}
      />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--c-border)] bg-[var(--c-input-bg)]">
            <HiOutlineHeart className="w-4 h-4 text-[var(--c-accent-green)]" />
            <span className="font-dm text-sm font-medium text-[var(--c-muted)] tracking-wide">
              Quem torna isso possível
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-dm text-[var(--c-muted)] leading-relaxed text-center max-w-xl mx-auto mb-10"
        >
          O projeto Catadores Digitais existe graças ao compromisso de organizações
          que acreditam no potencial transformador da educação tecnológica.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-5 md:gap-6"
        >
          {/* Column 1 — Realização / Instituto Ipês */}
          <motion.div variants={cardVariants} className="flex flex-col items-center gap-3">
            <span className="font-dm font-light text-sm tracking-[0.2em] uppercase text-[var(--c-subtle)]">
              Realização
            </span>
            <div
              className="w-full rounded-3xl p-8 min-h-[180px] flex items-center justify-center bg-gradient-to-br from-[#83B80D]/10 to-transparent glass-card"
              style={{ borderColor: 'rgba(131,184,13,0.2)' }}
            >
              <a href="https://institutoipes.org.br/" target="_blank" rel="noopener noreferrer">
                <img
                  src="/ipes-logo.webp"
                  alt="Instituto Ipês"
                  className="h-24 w-auto object-contain"
                  style={{ filter: isDark ? 'brightness(1.1) drop-shadow(0 0 12px rgba(255,255,255,0.08))' : 'none' }}
                />
              </a>
            </div>
          </motion.div>

          {/* Column 2 — Apoio financeiro / Caixa */}
          <motion.div variants={cardVariants} className="flex flex-col items-center gap-3">
            <span className="font-dm font-light text-sm tracking-[0.2em] uppercase text-[var(--c-subtle)]">
              Projeto apoiado com recursos
            </span>
            <div
              className="w-full rounded-3xl p-8 min-h-[180px] flex items-center justify-center"
              style={{ background: '#003087', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <a
                href="https://www.caixa.gov.br/sustentabilidade/fundo-socioambiental-caixa/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/fsc_negativa_chapada.png"
                  alt="Caixa Econômica Federal"
                  className="h-12 md:h-14 w-auto object-contain"
                />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}