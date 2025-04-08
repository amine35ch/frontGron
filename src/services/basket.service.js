import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetBasket = ({ paginated = false, pageSize = 10, page = 1, debouncedSearchTerm, model }) => {
  return useQuery({
    queryKey: ['baskets', page, pageSize, debouncedSearchTerm, model],

    queryFn: () =>
      axiosClient
        .get(
          `baskets?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }`
        )
        .then(res => res.data)
  })
}

export function useBasketRestore({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/baskets/${id}/back?model=${values} `, values)
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

export function useBasketDelete({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.delete(`/baskets/${id}/delete?model=${values}`, values)
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
