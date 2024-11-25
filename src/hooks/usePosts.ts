import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { Post, CreatePostInput, UpdatePostInput } from '../types/post'

export function useLocationPosts(
  locationId: string,
  page = 1,
  limit = 10,
  status?: string
) {
  return useQuery({
    queryKey: ['posts', locationId, page, limit, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status ? { status } : {})
      })
      const { data } = await api.get(`/posts/locations/${locationId}?${params}`)
      return data
    }
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      data: CreatePostInput
      files: File[]
    }) => {
      const formData = new FormData()
      
      // Append post data
      Object.entries(input.data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, typeof value === 'string' ? value : JSON.stringify(value))
        }
      })

      // Append media files
      input.files.forEach(file => {
        formData.append('media', file)
      })

      const { data } = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['posts', variables.data.locationId]
      })
    }
  })
}

export function useUpdatePost(postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      data: UpdatePostInput
      files?: File[]
    }) => {
      const formData = new FormData()
      
      // Append post data
      Object.entries(input.data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, typeof value === 'string' ? value : JSON.stringify(value))
        }
      })

      // Append media files
      input.files?.forEach(file => {
        formData.append('media', file)
      })

      const { data } = await api.patch(`/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['posts', variables.data.locationId]
      })
    }
  })
}

export function useApprovePost(postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/posts/${postId}/approve`)
      return data
    },
    onSuccess: (_, __, { locationId }) => {
      queryClient.invalidateQueries({
        queryKey: ['posts', locationId]
      })
    }
  })
}

export function useRejectPost(postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (reason: string) => {
      const { data } = await api.post(`/posts/${postId}/reject`, { reason })
      return data
    },
    onSuccess: (_, __, { locationId }) => {
      queryClient.invalidateQueries({
        queryKey: ['posts', locationId]
      })
    }
  })
}