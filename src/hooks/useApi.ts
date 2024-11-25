import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { api } from '../lib/axios'
import { ApiError, ApiResponse } from '../types/api'

// Generic GET hook
export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: UseQueryOptions<ApiResponse<T>, AxiosError<ApiError>>
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<T>>(url)
      return data
    },
    ...options
  })
}

// Generic POST hook
export function useApiMutation<T, V>(
  url: string,
  options?: UseMutationOptions<ApiResponse<T>, AxiosError<ApiError>, V>
) {
  return useMutation({
    mutationFn: async (variables: V) => {
      const { data } = await api.post<ApiResponse<T>>(url, variables)
      return data
    },
    ...options
  })
}

// Generic PUT hook
export function useApiPut<T, V>(
  url: string,
  options?: UseMutationOptions<ApiResponse<T>, AxiosError<ApiError>, V>
) {
  return useMutation({
    mutationFn: async (variables: V) => {
      const { data } = await api.put<ApiResponse<T>>(url, variables)
      return data
    },
    ...options
  })
}

// Generic DELETE hook
export function useApiDelete<T>(
  url: string,
  options?: UseMutationOptions<ApiResponse<T>, AxiosError<ApiError>, void>
) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<ApiResponse<T>>(url)
      return data
    },
    ...options
  })
}