import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'

export const useGetTypeDocumentForThirdPart = ({ id }) => {
  return useQuery({
    queryKey: ['type-documents-third-parties'],
    queryFn: () => axiosClient.get(`third-parties/${id}/documents`).then(res => res.data)
  })
}

export const useGetTypeDocumentForClient = ({ id }) => {
  return useQuery({
    queryKey: ['type-documents-clients'],
    queryFn: () => axiosClient.get(`clients/${id}/documents`).then(res => res.data)
  })
}

export const useGetTypeDocumentForCollaborators = ({ id }) => {
  return useQuery({
    queryKey: ['type-documents-collaborators'],
    queryFn: () => axiosClient.get(`collaborators/${id}/documents`).then(res => res.data)
  })
}

export const useGetTypeDocumentForProjects = ({ id }) => {
  return useQuery({
    queryKey: ['type-documents-projects'],
    queryFn: () => axiosClient.get(`projects/${id}/documents`).then(res => res.data)
  })
}

export function useViewGeneralDocumentData({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/projects/${id}/view/${values}`)
    },
    onSuccess: data => {
      // queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {}
  })

  return mutation
}
