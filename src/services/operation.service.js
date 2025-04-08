import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetListOperation = ({
  debouncedSearchTerm = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  intern,
  scenario,
  state
}) => {
  return useQuery({
    queryKey: ['list-operations', debouncedSearchTerm, page, pageSize, intern, scenario, state],
    queryFn: () =>
      axiosClient
        .get(
          `operations?${debouncedSearchTerm ? `&search=${debouncedSearchTerm}` : ''}${state ? `&state=${state}` : ''}${
            intern ? `&intern=${intern}` : ''
          }${scenario ? `&scenario=${scenario}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }`
        )
        .then(res => res.data)
  })
}

export function useCreateOperation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/operations`, values)
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

export function useUpdateOperation({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/operations/${id}?_method=put`, values)
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

export const useGetDetailOperation = ({ id, type }) => {
  return useQuery({
    queryKey: [`details-operations-${id}`],
    queryFn: () => axiosClient.get(`operations/${id}${type ? `?type=1` : ''}`).then(res => res.data)
  })
}

export function useDisabledOperation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.put(`operations/${id}/disable`)
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

export const useGetListDocument = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => axiosClient.get(`documents`).then(res => res.data)
  })
}
