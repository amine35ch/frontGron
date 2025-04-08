import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetBrands = ({
  search = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  state,
  type,
  debouncedSearchTerm
}) => {
  return useQuery({
    queryKey: ['brands', page, pageSize, state, type, debouncedSearchTerm],

    queryFn: () =>
      axiosClient
        .get(
          `brands?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${state ? `&state=${state}` : ''}${
            type ? `&type=${type}` : ''
          }${paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''}`
        )
        .then(res => res.data)
  })
}

export function useCreateBrand() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/brands`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateBrand({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/brands/${id}?_method=put`, values)
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

export const useGetDetailBrand = ({ id, type }) => {
  return useQuery({
    queryKey: [`details-brand-${id}`],
    queryFn: () => axiosClient.get(`brands/${id}${type ? `?type=1` : ''}`).then(res => res.data)
  })
}

export function useDisabledBrands({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      return axiosClient.put(`brands/${id}/disable`)
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

export function useEnableBrands({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      return axiosClient.put(`brands/${id}/enable`)
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

export function useValidateBrands({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      return axiosClient.put(`brands/${id}/validate`)
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

export function useToggleAccessBrands({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      return axiosClient.put(`brands/${id}/toggle-access`)
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

export function useDeleteBrand() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`brands/${id}`)
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
