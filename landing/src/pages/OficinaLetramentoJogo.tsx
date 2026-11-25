import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlineArrowPath,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineChevronDown,
  HiOutlineExclamationTriangle,
  HiOutlineLightBulb,
  HiOutlineShieldCheck,
  HiOutlineShieldExclamation,
  HiOutlineUserCircle,
  HiOutlineXCircle,
} from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';

// Jogo portado do artefato "Mensagem verdadeira ou falsa".
// Todos os nomes, números e links são inventados.
type Mensagem = {
  who: string;
  texto: string;
  verdadeira: boolean;
  sinais: string[];
  dica: string;
};

const MENSAGENS: Mensagem[] = [
  {
    who: '+55 61 9xxxx-0001',
    texto:
      'INSS INFORMA: seu benefício será BLOQUEADO hoje. Atualize seus dados agora em http://inss-liberacao.exemplo e informe a senha e o código que chegar por SMS.',
    verdadeira: false,
    sinais: ['Pressa: bloqueio "hoje".', 'Pede senha e código do SMS.', 'Link estranho, que não é o endereço oficial.'],
    dica: 'Benefício de verdade se consulta no aplicativo Meu INSS, aberto por você, nunca por link recebido.',
  },
  {
    who: 'Banco Exemplo',
    texto:
      'Banco Exemplo: compra aprovada de R$ 45,90 em MERCADO CENTRAL. Se não reconhece, ligue para o número que está no verso do seu cartão.',
    verdadeira: true,
    sinais: ['Só avisa de uma compra.', 'Não pede senha, código nem link.', 'Manda ligar para o número que já está no cartão.'],
    dica: 'Mesmo assim, se você não fez a compra, ligue pelo número do cartão, não por número que veio na mensagem.',
  },
  {
    who: '+55 11 9xxxx-0002',
    texto:
      'Oi mãe, mudei de número, perdi meu celular. Salva esse aqui. Preciso fazer um pix urgente, depois te explico. Pode me ajudar?',
    verdadeira: false,
    sinais: ['"Número novo" sem prova de quem é.', 'Pressa e pedido de dinheiro.', 'Foto de perfil e conversa começam do zero.'],
    dica: 'Ligue para o número antigo ou para outra pessoa da família antes de mandar qualquer valor.',
  },
  {
    who: 'Posto de Saúde Exemplo',
    texto:
      'Lembrete: sua consulta no Posto de Saúde é amanhã, às 8h. Leve o cartão do SUS e um documento com foto. Para desmarcar, responda NÃO.',
    verdadeira: true,
    sinais: ['Você marcou essa consulta.', 'Não pede dinheiro, senha nem dados.', 'Não tem link.'],
    dica: 'Se não lembra de ter marcado, confirme ligando para o posto.',
  },
  {
    who: '+55 21 9xxxx-0003',
    texto:
      'PARABÉNS! Você foi sorteado e ganhou R$ 1.000 do governo. Para liberar o prêmio, pague a taxa de R$ 38 por PIX agora. Vagas limitadas!',
    verdadeira: false,
    sinais: ['Prêmio que você não pediu.', 'Pede dinheiro para liberar.', 'Pressa: "vagas limitadas".'],
    dica: 'Quem ganha de verdade não paga taxa para receber.',
  },
  {
    who: 'gov.br',
    texto: 'Seu código de verificação gov.br é 482913. Não compartilhe com ninguém.',
    verdadeira: true,
    sinais: ['Chegou logo depois de você tentar entrar na conta.', 'Avisa para não compartilhar.', 'Não tem link.'],
    dica: 'É de verdade só se foi você que pediu. Se chegou sem você tentar entrar, alguém está tentando usar a sua conta: não passe o código a ninguém.',
  },
  {
    who: '+55 61 9xxxx-0004',
    texto:
      'VAGA DE EMPREGO: trabalhe de casa e ganhe R$ 300 por dia, sem experiência. Mande agora, por aqui, foto do seu RG e CPF para começar hoje!',
    verdadeira: false,
    sinais: ['Ganho alto e fácil.', 'Pede foto de documento por mensagem.', 'Pressa: "começar hoje".'],
    dica: 'Empresa séria combina entrevista e não pede documento antes de se apresentar.',
  },
  {
    who: 'Grupo da Cooperativa',
    texto:
      'Pessoal, a reunião da cooperativa é sábado, às 9h, na sede. Pauta: venda do papelão e escala da semana. Quem não puder, avisa aqui no grupo.',
    verdadeira: true,
    sinais: ['Vem de um grupo que você conhece.', 'Não pede dinheiro, código nem link.', 'Fala de algo que a cooperativa realmente faz.'],
    dica: 'Mensagem normal do dia a dia. O que importa é conhecer quem mandou.',
  },
];

const VERDE = '#15803D';
const VERMELHO = '#B91C1C';

export function OficinaLetramentoJogo() {
  const { isDark } = useTheme();
  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [resposta, setResposta] = useState<boolean | null>(null);
  const [fim, setFim] = useState(false);
  const proximoRef = useRef<HTMLButtonElement>(null);
  const topoRef = useRef<HTMLDivElement>(null);

  const m = MENSAGENS[indice];
  const respondeu = resposta !== null;
  const acertou = respondeu && resposta === m.verdadeira;
  const ultima = indice === MENSAGENS.length - 1;
  const progresso = fim ? 100 : ((indice + (respondeu ? 1 : 0)) / MENSAGENS.length) * 100;

  const verde = isDark ? '#4ADE80' : VERDE;
  const vermelho = isDark ? '#F87171' : VERMELHO;

  useEffect(() => {
    if (respondeu) proximoRef.current?.focus({ preventScroll: true });
  }, [respondeu]);

  function responder(dizVerdadeira: boolean) {
    if (respondeu) return;
    setResposta(dizVerdadeira);
    if (dizVerdadeira === m.verdadeira) setAcertos((a) => a + 1);
  }

  function proxima() {
    if (ultima) {
      setFim(true);
    } else {
      setIndice((i) => i + 1);
      setResposta(null);
    }
    topoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function reiniciar() {
    setIndice(0);
    setAcertos(0);
    setResposta(null);
    setFim(false);
    topoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const chatBg = isDark ? '#1C1A24' : '#EFE7DD';
  const bubbleBg = isDark ? '#1F3B2A' : '#E7FFDB';

  return (
    <main>
      <section className="relative pt-28 pb-24 md:pt-36 md:pb-32 overflow-hidden">
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, #06030F, #120A24, #06030F)'
              : 'linear-gradient(to bottom, #FFFFFF, #F1EEFB, #FFFFFF)',
          }}
        />

        <div ref={topoRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-28">
          <Link
            to="/oficinaletramento"
            className="inline-flex items-center gap-2 font-dm text-sm text-[var(--c-muted)] hover:text-[var(--c-text)] transition-colors mb-6"
          >
            <HiOutlineArrowLeft className="w-4 h-4" /> Voltar para a oficina
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
                <HiOutlineShieldCheck className="w-6 h-6 text-[var(--c-accent-blue)]" />
              </div>
              <span className="font-syne font-bold text-xs tracking-wide uppercase text-[var(--c-accent-blue)]">
                Jogo de proteção digital
              </span>
            </div>
            <h1 className="font-syne font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight text-[var(--c-text)] mb-3">
              Mensagem verdadeira ou falsa?
            </h1>
            <p className="font-dm text-base md:text-lg text-[var(--c-muted)] leading-relaxed">
              Leia a mensagem que chegou no celular. Decidam em dupla: é uma mensagem de
              verdade ou um golpe? Todos os nomes, números e links deste exercício são inventados.
            </p>
          </header>

          {/* Placar + progresso */}
          <div className="flex items-center justify-between gap-3 mb-3 font-syne font-bold text-sm">
            <span className="px-3.5 py-1.5 rounded-full glass-card text-[var(--c-text)]">
              {fim ? 'Fim de jogo' : `Mensagem ${indice + 1} de ${MENSAGENS.length}`}
            </span>
            <span className="px-3.5 py-1.5 rounded-full glass-card text-[var(--c-text)]">
              ✅ Acertos: {acertos}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[var(--c-input-bg)] overflow-hidden mb-6">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #114BF2, #4D1BBB)' }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {!fim ? (
              <motion.div
                key={indice}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                aria-live="polite"
              >
                {/* Tela de conversa */}
                <div
                  className="rounded-3xl p-4 sm:p-5 border border-[var(--c-border)]"
                  style={{ background: chatBg }}
                >
                  <div className="flex items-center gap-2 mb-3 font-dm text-sm font-semibold text-[var(--c-muted)]">
                    <HiOutlineUserCircle className="w-6 h-6" />
                    Mensagem de {m.who}
                  </div>
                  <div
                    className="rounded-[6px_18px_18px_18px] px-4 py-3.5 max-w-[95%] shadow-sm"
                    style={{ background: bubbleBg }}
                  >
                    <p className="font-dm text-lg sm:text-xl leading-snug text-[var(--c-text)] break-words">
                      {m.texto}
                    </p>
                    <span className="block text-right text-xs text-[var(--c-subtle)] mt-1.5">agora ✓✓</span>
                  </div>
                </div>

                {/* Botões */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  {[
                    { valor: true, label: 'Mensagem de verdade', Icon: HiOutlineShieldCheck, cor: verde },
                    { valor: false, label: 'É golpe', Icon: HiOutlineShieldExclamation, cor: vermelho },
                  ].map(({ valor, label, Icon, cor }) => {
                    const escolhido = resposta === valor;
                    return (
                      <motion.button
                        key={label}
                        type="button"
                        onClick={() => responder(valor)}
                        disabled={respondeu}
                        whileHover={respondeu ? undefined : { y: -2 }}
                        whileTap={respondeu ? undefined : { scale: 0.97 }}
                        className="flex items-center justify-center gap-2.5 font-syne font-bold text-lg px-4 py-4 rounded-2xl border-2 transition-opacity focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
                        style={{
                          borderColor: cor,
                          color: escolhido ? '#fff' : cor,
                          background: escolhido ? cor : 'var(--c-glass-bg)',
                          opacity: respondeu && !escolhido ? 0.45 : 1,
                          cursor: respondeu ? 'default' : 'pointer',
                        }}
                      >
                        <Icon className="w-6 h-6" /> {label}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Resultado */}
                <AnimatePresence>
                  {respondeu && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-5 rounded-2xl p-5 border-2"
                      style={{
                        borderColor: acertou ? verde : vermelho,
                        background: acertou ? `${verde}14` : `${vermelho}14`,
                      }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {acertou ? (
                          <HiOutlineCheckCircle className="w-7 h-7 shrink-0" style={{ color: verde }} />
                        ) : (
                          <HiOutlineXCircle className="w-7 h-7 shrink-0" style={{ color: vermelho }} />
                        )}
                        <h2 className="font-syne font-bold text-xl text-[var(--c-text)] leading-snug">
                          {acertou ? 'Acertou! ' : 'Quase! '}
                          {m.verdadeira ? 'Essa é uma mensagem de verdade.' : 'Essa é um golpe.'}
                        </h2>
                      </div>

                      <p className="font-dm font-semibold text-[var(--c-text)] mb-2">
                        {m.verdadeira ? 'Por que dá para confiar:' : 'Sinais de alerta:'}
                      </p>
                      <ul className="space-y-1.5 mb-4">
                        {m.sinais.map((s) => (
                          <li key={s} className="flex items-start gap-2 font-dm text-[var(--c-muted)]">
                            {m.verdadeira ? (
                              <HiOutlineCheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: verde }} />
                            ) : (
                              <HiOutlineExclamationTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: vermelho }} />
                            )}
                            {s}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-start gap-2 rounded-xl p-3.5 bg-[var(--c-glass-bg)] border border-[var(--c-border)]">
                        <HiOutlineLightBulb className="w-5 h-5 shrink-0 mt-0.5 text-[#E8590C]" />
                        <p className="font-dm text-[var(--c-text)]">
                          <strong className="font-syne">Dica:</strong> {m.dica}
                        </p>
                      </div>

                      <button
                        ref={proximoRef}
                        type="button"
                        onClick={proxima}
                        className="mt-5 w-full inline-flex items-center justify-center gap-2 font-syne font-bold text-lg text-white px-4 py-4 rounded-2xl hover:opacity-90 transition-opacity"
                        style={{ background: 'linear-gradient(135deg, #114BF2, #4D1BBB)' }}
                      >
                        {ultima ? 'Ver resultado' : 'Próxima mensagem'}
                        <HiOutlineArrowRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="fim"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card rounded-3xl p-7 md:p-10 text-center"
              >
                <div className="text-5xl mb-3">
                  {acertos === MENSAGENS.length ? '🏆' : acertos >= 6 ? '🎉' : '💪'}
                </div>
                <p className="font-dm text-[var(--c-muted)] mb-1">Vocês acertaram</p>
                <p className="font-syne font-extrabold text-6xl text-[var(--c-text)] mb-6">
                  {acertos} <span className="text-3xl text-[var(--c-subtle)]">de {MENSAGENS.length}</span>
                </p>

                <div
                  className="text-left rounded-2xl p-5 border-2 mb-6 flex items-start gap-3"
                  style={{ borderColor: verde, background: `${verde}14` }}
                >
                  <HiOutlineShieldCheck className="w-7 h-7 shrink-0" style={{ color: verde }} />
                  <p className="font-dm text-[var(--c-text)] leading-relaxed">
                    <strong className="font-syne">Regra de ouro:</strong> na dúvida, não clique, não
                    responda e não passe nenhum código. Confirme por outro canal, ligando para quem
                    diz ter mandado, pelo número que você já tinha.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={reiniciar}
                    className="flex-1 inline-flex items-center justify-center gap-2 font-syne font-bold text-lg text-white px-4 py-4 rounded-2xl hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, #114BF2, #4D1BBB)' }}
                  >
                    <HiOutlineArrowPath className="w-5 h-5" /> Jogar de novo
                  </button>
                  <Link
                    to="/oficinaletramento"
                    className="flex-1 inline-flex items-center justify-center gap-2 font-syne font-bold text-lg text-[var(--c-text)] px-4 py-4 rounded-2xl border-2 border-[var(--c-border-md)] hover:border-brand-blue/50 transition-colors"
                  >
                    <HiOutlineArrowLeft className="w-5 h-5" /> Voltar à oficina
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gabarito */}
          <details className="group glass-card rounded-2xl mt-10 overflow-hidden">
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none p-5 font-syne font-bold text-[var(--c-text)] [&::-webkit-details-marker]:hidden">
              <span>📋 Gabarito do instrutor</span>
              <HiOutlineChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
            </summary>
            <ol className="px-5 pb-5 space-y-4">
              {MENSAGENS.map((g, k) => (
                <li key={k} className="border-t border-[var(--c-border)] pt-4 font-dm text-sm">
                  <span
                    className="inline-block font-syne font-bold text-xs px-2.5 py-0.5 rounded-full mr-2 text-white"
                    style={{ background: g.verdadeira ? verde : vermelho, color: isDark ? '#06030F' : '#fff' }}
                  >
                    {g.verdadeira ? 'Verdadeira' : 'Golpe'}
                  </span>
                  <strong className="text-[var(--c-text)]">{k + 1}.</strong>{' '}
                  <span className="text-[var(--c-text)]">{g.texto}</span>
                  <p className="text-[var(--c-subtle)] mt-1">{g.sinais.join(' ')}</p>
                </li>
              ))}
            </ol>
          </details>
        </div>
      </section>
    </main>
  );
}
