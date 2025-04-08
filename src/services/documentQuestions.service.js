import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetDataFicheNavetteForProject = ({ id }) => {
  return useQuery({
    queryKey: ['fiche-navette', id],
    queryFn: () => axiosClient.get(`/document-questions/${id}/syntheseShuttleData`).then(res => res.data)
  })
}

export function usePostDataFicheNavetteForProject({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/document-questions/${id}/syntheseShuttleData`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries()
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function usePostImageFicheNavetteForProject({ id, idDoc }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/document-questions/${id}/${idDoc}/images/`, values)
    },

    onSuccess: data => {
      // toast.success(data?.data?.message)
      // queryClient.invalidateQueries()
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function usePostDataSyntheseAuditProject({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/${id}/audit-form`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries()
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function usePvReceptionDataProject({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/${id}/pv-reception-form`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries()
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}
