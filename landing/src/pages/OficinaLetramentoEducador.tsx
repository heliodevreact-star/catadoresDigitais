import { motion } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlineArrowTopRightOnSquare,
  HiOutlinePresentationChartBar,
} from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';

const APRESENTACAO_PROFESSOR =
  'https://docs.google.com/presentation/d/1dVkN4VlJcpoIoqmI_rzaqe3hzszRwlKo/edit?usp=sharing&ouid=103849108207813228479&rtpof=true&sd=true';

export function OficinaLetramentoEducador() {
  const { isDark } = useTheme();

  return (
    <main>
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 min-h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, #06030F, #0A1420, #06030F)'
              : 'linear-gradient(to bottom, #FFFFFF, #F2F7EC, #FFFFFF)',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 mb-6"
            >
              <HiOutlineAcademicCap className="w-4 h-4 text-[var(--c-accent-blue)]" />
              <span className="font-dm text-sm font-medium text-[var(--c-accent-blue)] tracking-wide">
                Área do educador
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
              Material de apoio para quem conduz a oficina.
            </motion.p>
          </div>

          <motion.a
            href={APRESENTACAO_PROFESSOR}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.15 } }}
            className="group relative block rounded-3xl p-7 md:p-9 overflow-hidden text-white"
            style={{ background: 'linear-gradient(135deg, #114BF2 0%, #4D1BBB 100%)' }}
          >
            <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute right-24 -bottom-16 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <HiOutlinePresentationChartBar className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <span className="font-syne font-bold text-xs tracking-wide uppercase text-white/75">
                  Google Slides
                </span>
                <h2 className="font-syne font-extrabold text-2xl md:text-3xl mt-1 mb-2">
                  Apresentação do professor
                </h2>
                <p className="font-dm text-base text-white/85 leading-relaxed">
                  Os slides que guiam a oficina, para conduzir a aula com a turma.
                </p>
              </div>
              <span className="inline-flex items-center justify-center gap-2 font-syne font-bold text-base bg-white text-[#114BF2] px-6 py-3.5 rounded-xl shrink-0">
                Abrir apresentação
                <HiOutlineArrowTopRightOnSquare className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </motion.a>
        </div>
      </section>
    </main>
  );
}
