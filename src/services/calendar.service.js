import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetAllProjectVisits = ({ project, company, user, supervisor }) => {
  return useQuery({
    queryKey: ['project-visits', project, company, user, supervisor],
    queryFn: () =>
      axiosClient
        .get(
          `/project-visits?${project ? `&project=${project}` : ''}${company ? `&company=${company}` : ''}${
            user ? `&user=${user}` : ''
          }`,
          { params: { project } }
        )
        .then(res => res.data)
  })
}

export const useGetEventById = idEvent => {
  return useQuery({
    queryKey: ['project-visit', idEvent],
    queryFn: () => axiosClient.get(`/project-visits/${idEvent}`).then(res => res.data)
  })
}

export function useUpdateProjectVisit() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ eventId, state, ...values }) => {
      return axiosClient.put(`/project-visits/${eventId}/validation?${state ? `state=${state}` : ''}`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['project-visits'] })
    },
    onError: error => {
      toast.error(error?.response?.data?.message)
    }
  })

  return mutation
}

export function useCreateProjectVisit() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: projectVisitData => {
      return axiosClient.post(`/project-visits`, projectVisitData)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['project-visits'] })
    },
    onError: error => {
      toast.error(error?.response?.data?.message)
    }
  })

  return mutation
}
