'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { DiplomaMilestone, DiplomaEmitido } from '@/types'

interface CreateMilestoneInput {
  title: string
  description?: string
  achievedDate: string
  hours: number
  recipientEmails: string[]
}

interface UpdateMilestoneInput {
  milestoneId: string
  title: string
  description?: string
  achievedDate: string
  hours: number
}

interface IssueInput {
  milestoneId: string
  recipients: { email: string; cpf: string }[]
}

interface IssueResult {
  issued: { id: string; email: string }[]
  skipped: { email: string; reason: string }[]
}

export function useDiplomas(turmaId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['turmas', turmaId, 'diplomas']

  const query = useQuery<DiplomaMilestone[]>({
    queryKey,
    queryFn: () => fetch(`/api/turmas/${turmaId}/diplomas`).then((r) => r.json()),
    staleTime: 30 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: (input: CreateMilestoneInput) =>
      fetch(`/api/turmas/${turmaId}/diplomas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? 'Erro ao criar diploma.')
        return r.json() as Promise<{ id: string }>
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ milestoneId, ...input }: UpdateMilestoneInput) =>
      fetch(`/api/turmas/${turmaId}/diplomas/${milestoneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? 'Erro ao salvar diploma.')
        return r.json()
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  const deleteMutation = useMutation({
    mutationFn: (milestoneId: string) =>
      fetch(`/api/turmas/${turmaId}/diplomas/${milestoneId}`, { method: 'DELETE' }),
    onSuccess: (_, milestoneId) =>
      queryClient.setQueryData<DiplomaMilestone[]>(queryKey, (prev) => prev?.filter((m) => m.id !== milestoneId) ?? []),
  })

  const issueMutation = useMutation({
    mutationFn: ({ milestoneId, recipients }: IssueInput) =>
      fetch(`/api/turmas/${turmaId}/diplomas/${milestoneId}/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients }),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? 'Erro ao emitir diplomas.')
        return r.json() as Promise<IssueResult>
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  return {
    milestones: query.data ?? [],
    milestonesLoading: query.isLoading,
    createMilestone: createMutation.mutateAsync,
    creatingMilestone: createMutation.isPending,
    updateMilestone: updateMutation.mutateAsync,
    updatingMilestone: updateMutation.isPending,
    deleteMilestone: deleteMutation.mutateAsync,
    deletingMilestone: deleteMutation.isPending ? deleteMutation.variables! : null,
    issueMilestone: issueMutation.mutateAsync,
    issuing: issueMutation.isPending,
  }
}

export function useIssuedDiplomas(turmaId: string, milestoneId: string, enabled: boolean) {
  const query = useQuery<DiplomaEmitido[]>({
    queryKey: ['turmas', turmaId, 'diplomas', milestoneId, 'issued'],
    queryFn: () => fetch(`/api/turmas/${turmaId}/diplomas/${milestoneId}/issued`).then((r) => r.json()),
    enabled,
    staleTime: 15 * 1000,
  })

  return { issued: query.data ?? [], issuedLoading: query.isLoading, refetchIssued: query.refetch }
}
