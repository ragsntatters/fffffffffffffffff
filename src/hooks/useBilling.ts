import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../lib/axios'

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data } = await api.get('/billing/subscription')
      return data
    }
  })
}

export function useInvoices(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['invoices', page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/billing/invoices?page=${page}&limit=${limit}`)
      return data
    }
  })
}

export function useUsage(feature?: string) {
  return useQuery({
    queryKey: ['usage', feature],
    queryFn: async () => {
      const params = new URLSearchParams(feature ? { feature } : {})
      const { data } = await api.get(`/billing/usage?${params}`)
      return data
    }
  })
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (input: { planId: string; quantity?: number }) => {
      const { data } = await api.post('/billing/checkout', input)
      return data
    }
  })
}

export function useGetBillingPortal() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get('/billing/portal')
      return data
    }
  })
}