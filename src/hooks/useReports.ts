import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { ReportConfig } from '../types/report'

export function useReports(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['reports', page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/reports?page=${page}&limit=${limit}`)
      return data
    }
  })
}

export function useCreateReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (config: ReportConfig) => {
      const { data } = await api.post('/reports', config)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    }
  })
}

export function useGenerateReport(reportId: string) {
  return useMutation({
    mutationFn: async (format?: string) => {
      const params = new URLSearchParams(format ? { format } : {})
      const response = await api.get(`/reports/${reportId}/generate?${params}`, {
        responseType: format ? 'blob' : 'json'
      })
      
      if (format) {
        // Handle file download
        const blob = new Blob([response.data])
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `report.${format}`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      }
      
      return response.data
    }
  })
}

export function useUpdateReport(reportId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<ReportConfig>) => {
      const { data } = await api.patch(`/reports/${reportId}`, updates)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    }
  })
}

export function useDeleteReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (reportId: string) => {
      const { data } = await api.delete(`/reports/${reportId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    }
  })
}