import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { Review, CreateReviewResponse } from '../types/review'

export function useLocationReviews(
  locationId: string,
  page = 1,
  limit = 10,
  status?: string
) {
  return useQuery({
    queryKey: ['reviews', locationId, page, limit, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status ? { status } : {})
      })
      const { data } = await api.get(`/reviews/locations/${locationId}?${params}`)
      return data
    }
  })
}

export function useReviewMetrics(
  locationId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ['review-metrics', locationId, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {})
      })
      const { data } = await api.get(`/reviews/locations/${locationId}/metrics?${params}`)
      return data
    }
  })
}

export function useSyncReviews(locationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/reviews/locations/${locationId}/sync`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', locationId] })
      queryClient.invalidateQueries({ queryKey: ['review-metrics', locationId] })
    }
  })
}

export function useRespondToReview(reviewId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (response: CreateReviewResponse) => {
      const { data } = await api.post(`/reviews/${reviewId}/responses`, response)
      return data
    },
    onSuccess: (_, __, { locationId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', locationId] })
    }
  })
}

export function useApproveResponse(responseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/reviews/responses/${responseId}/approve`)
      return data
    },
    onSuccess: (_, __, { locationId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', locationId] })
    }
  })
}