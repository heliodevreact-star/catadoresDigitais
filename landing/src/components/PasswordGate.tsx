import { useState, type FormEvent, type ReactNode } from 'react';
import { HiLockClosed } from 'react-icons/hi2';
import { Logo } from './Logo';

const ACCESS_KEY = 'cd-access-granted';
const SITE_PASSWORD = 'caixafsa2026';

export function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(ACCESS_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      try {
        localStorage.setItem(ACCESS_KEY, 'true');
      } catch {
        // localStorage indisponível — segue liberado só para esta renderização.
      }
      setError(false);
      setUnlocked(true);
    } else {
      setError(true);
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--c-bg)' }}>
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 text-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'var(--c-input-bg)' }}
          >
            <HiLockClosed className="w-5 h-5 text-brand-blue" />
          </div>

          <h1 className="font-syne font-bold text-xl text-[var(--c-text)] mb-2">Acesso restrito</h1>
          <p className="font-dm text-sm text-[var(--c-muted)] mb-6 leading-relaxed">
            Este site está temporariamente disponível apenas com senha.
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Senha de acesso"
            autoFocus
            className="w-full bg-[var(--c-input-bg)] border border-[var(--c-border)] text-[var(--c-text)] placeholder-[var(--c-subtle)] font-dm text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-brand-blue/50 transition-colors text-center"
          />

          {error && (
            <p className="font-dm text-xs mt-3" style={{ color: '#FF6B35' }}>
              Senha incorreta. Tente novamente.
            </p>
          )}

          <button
            type="submit"
            className="w-full font-syne font-bold text-white px-6 py-3 rounded-xl mt-5 transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #517208, #114BF2)' }}
            disabled={!password.trim()}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
