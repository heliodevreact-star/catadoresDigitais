'use client'

import Link from 'next/link'
import { useAdminLeads } from '@/hooks/useAdminLeads'
import { Tooltip } from '@/components/Tooltip'
import { HiArrowLeft, HiTrash, HiEnvelope } from 'react-icons/hi2'

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR')
}

export default function LeadsPage() {
  const { leads, leadsLoading, removeLead, removingLead } = useAdminLeads()

  return (
    <main className="p-6 md:p-8">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <Tooltip label="Voltar">
            <Link
              href="/dashboard/admin"
              aria-label="Voltar"
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: 'var(--c-border-md)', color: 'var(--c-subtle)' }}
            >
              <HiArrowLeft className="w-4 h-4" />
            </Link>
          </Tooltip>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--c-text)' }}>
            Interessados nos cursos cadastrados através da landing page
          </h2>
        </div>

        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--c-bg-alt)', borderColor: 'var(--c-border)' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--c-border)' }}>
            <p className="text-sm" style={{ color: 'var(--c-subtle)' }}>
              {leadsLoading ? 'Carregando...' : `${leads.length} email${leads.length !== 1 ? 's' : ''} cadastrado${leads.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {leadsLoading ? (
            <div className="px-6 py-10 text-center text-sm" style={{ color: 'var(--c-subtle)' }}>
              Carregando...
            </div>
          ) : leads.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm" style={{ color: 'var(--c-subtle)' }}>
              Ninguém se cadastrou ainda.
            </div>
          ) : (
            <ul>
              {leads.map((lead, i) => (
                <li
                  key={lead.id}
                  className="flex items-center gap-4 px-6 py-3.5"
                  style={{ borderTop: i === 0 ? 'none' : `1px solid var(--c-border)` }}
                >
                  <HiEnvelope className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--c-subtle)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: 'var(--c-text)' }}>{lead.email}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--c-faint)' }}>{fmt(lead.createdAt)}</p>
                  </div>
                  <Tooltip label="Remover">
                    <button
                      onClick={() => removeLead(lead.id)}
                      disabled={removingLead === lead.id}
                      aria-label="Remover"
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors flex-shrink-0 disabled:opacity-50"
                      style={{ borderColor: 'var(--c-border-md)', color: 'var(--c-faint)' }}
                    >
                      {removingLead === lead.id ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <HiTrash className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </Tooltip>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
