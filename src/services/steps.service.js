import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetListSteps = () => {
  return useQuery({
    queryKey: ['list-steps'],
    queryFn: () => axiosClient.get(`steps`).then(res => res.data)
  })
}

export function useGoToNextStepInProject({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      return axiosClient.post(`/projects/${id}/next-step?_method=put`)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useGoToPrevStepInProject({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      return axiosClient.put(`/projects/${id}/prev-step `)
    },

    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useForwardStep({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      return axiosClient.post(`/projects/${id}/forward-step?_method=put`)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}
