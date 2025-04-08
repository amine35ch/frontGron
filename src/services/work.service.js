import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetBars = ({
  search = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  state,
  type,
  debouncedSearchTerm
}) => {
  return useQuery({
    queryKey: ['bars', page, pageSize, state, type, debouncedSearchTerm],

    queryFn: () =>
      axiosClient
        .get(
          `bars?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${state ? `&state=${state}` : ''}${
            type ? `&type=${type}` : ''
          }${paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''}`
        )
        .then(res => res.data)
  })
}

export const useGetWorks = ({
  search = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  state,
  type,
  debouncedSearchTerm
}) => {
  return useQuery({
    queryKey: ['works', page, pageSize, state, type, debouncedSearchTerm],

    queryFn: () =>
      axiosClient
        .get(
          `works?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${state ? `&state=${state}` : ''}${
            type ? `&type=${type}` : ''
          }${paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''}`
        )
        .then(res => res.data)
  })
}

export function useCreateWorks() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/works`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['works'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateWorks({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/works/${id}?_method=put`, values)
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

export const useGetDetailWorks = ({ id, type }) => {
  return useQuery({
    queryKey: [`details-work-${id}`],
    queryFn: () => axiosClient.get(`works/${id}${type ? `?type=1` : ''}`).then(res => res.data)
  })
}

export function useDeleteWorks() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`works/${id}`)
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

export function useDisabledWorks() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.put(`works/${id}/disable`)
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
