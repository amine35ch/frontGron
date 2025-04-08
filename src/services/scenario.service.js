import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetListScenario = ({
  debouncedSearchTerm = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  intern,
  scenario,
  state
}) => {
  return useQuery({
    queryKey: ['list-scenarios', debouncedSearchTerm, page, pageSize, intern, scenario, state],
    queryFn: () =>
      axiosClient
        .get(
          `scenarios?${debouncedSearchTerm ? `&search=${debouncedSearchTerm}` : ''}${state ? `&state=${state}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }`
        )
        .then(res => res.data)
  })
}

export function useCreateScenario() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/scenarios`, values)
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

export function useUpdateScenario({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/scenarios/${id}?_method=put`, values)
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

export const useGetDetailScenario = ({ id, type }) => {
  return useQuery({
    queryKey: [`details-scenarios-${id}`],
    queryFn: () => axiosClient.get(`scenarios/${id}${type ? `?type=1` : ''}`).then(res => res.data)
  })
}

export function useDisabledScenario({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.put(`scenarios/${id}/disable`)
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
