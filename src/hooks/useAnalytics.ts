import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { Analytics } from '../types/analytics'

export function useLocationAnalytics(
  locationId: string,
  type?: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ['analytics', locationId, type, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(type ? { type } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {})
      })
      const { data } = await api.get(`/analytics/locations/${locationId}?${params}`)
      return data
    }
  })
}

export function useGenerateAnalytics(locationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (date: string) => {
      const { data } = await api.post(`/analytics/locations/${locationId}/generate`, { date })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', locationId] })
    }
  })
}