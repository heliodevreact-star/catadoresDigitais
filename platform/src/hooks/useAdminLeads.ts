'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Lead } from '@/types'

export function useAdminLeads() {
  const queryClient = useQueryClient()

  const query = useQuery<Lead[]>({
    queryKey: ['admin', 'leads'],
    queryFn: () => fetch('/api/admin/leads').then((r) => r.json()),
    staleTime: 60 * 1000,
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/leads/${id}`, { method: 'DELETE' }),
    onSuccess: (_, id) =>
      queryClient.setQueryData<Lead[]>(['admin', 'leads'], (prev) => prev?.filter((l) => l.id !== id) ?? []),
  })

  return {
    leads: query.data ?? [],
    leadsLoading: query.isLoading,
    removeLead: removeMutation.mutateAsync,
    removingLead: removeMutation.isPending ? removeMutation.variables! : null,
  }
}
