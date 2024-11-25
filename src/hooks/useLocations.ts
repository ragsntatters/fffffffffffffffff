import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { Location, CreateLocationInput, UpdateLocationInput } from '../types/location'

export function useLocations(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['locations', page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/locations?page=${page}&limit=${limit}`)
      return data
    }
  })
}

export function useLocation(id: string) {
  return useQuery({
    queryKey: ['locations', id],
    queryFn: async () => {
      const { data } = await api.get(`/locations/${id}`)
      return data
    }
  })
}

export function useCreateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateLocationInput) => {
      const { data } = await api.post('/locations', input)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    }
  })
}

export function useUpdateLocation(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateLocationInput) => {
      const { data } = await api.patch(`/locations/${id}`, input)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', id] })
    }
  })
}

export function useDeleteLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/locations/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    }
  })