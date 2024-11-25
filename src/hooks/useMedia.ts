import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { UploadResult } from '../types/media'

export function useUploadMedia() {
  return useMutation({
    mutationFn: async (data: {
      file: File
      prefix?: string
      generateThumbnail?: boolean
      optimize?: boolean
    }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      if (data.prefix) formData.append('prefix', data.prefix)
      if (data.generateThumbnail) formData.append('generateThumbnail', 'true')
      if (data.optimize === false) formData.append('optimize', 'false')

      const response = await api.post<{ data: UploadResult }>('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data.data
    }
  })
}

export function useUploadMultipleMedia() {
  return useMutation({
    mutationFn: async (data: {
      files: File[]
      prefix?: string
      generateThumbnail?: boolean
      optimize?: boolean
    }) => {
      const formData = new FormData()
      data.files.forEach(file => formData.append('files', file))
      if (data.prefix) formData.append('prefix', data.prefix)
      if (data.generateThumbnail) formData.append('generateThumbnail', 'true')
      if (data.optimize === false) formData.append('optimize', 'false')

      const response = await api.post<{ data: UploadResult[] }>('/media/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data.data
    }
  })
}

export function useMediaUrl(key: string) {
  return useQuery({
    queryKey: ['media', key],
    queryFn: async () => {
      const response = await api.get<{ data: { url: string } }>(`/media/${key}`)
      return response.data.data.url
    }
  })
}

export function useDeleteMedia() {
  return useMutation({
    mutationFn: async (key: string) => {
      await api.delete(`/media/${key}`)
    }
  })
}