import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetArticles = ({
  search = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  state,
  type = false,
  debouncedSearchTerm,
  access,
  always = false,
  work
}) => {
  return useQuery({
    queryKey: ['articles', page, pageSize, state, type, debouncedSearchTerm, access, work],

    queryFn: async () => {
      if (type === '0') {
        return await axiosClient
          .get(
            `products?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${state ? `&state=${state}` : ''}${
              paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
            }${access ? `&access=${access}` : ''}${always !== false ? `&always=${always}` : ''}${
              work ? `&work=${work}` : ''
            } `
          )
          .then(res => res.data)
      }

      return await axiosClient
        .get(
          `articles?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${state ? `&state=${state}` : ''}${
            type ? `&type=${type}` : ''
          }${paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''}${
            access ? `&access=${access}` : ''
          }${always !== false ? `&always=${always}` : ''}${work ? `&work=${work}` : ''} `
        )
        .then(res => res.data)
    }
  })
}

export function useCreateArticles() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/articles`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/products`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      // queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateArticles({ id, type = '1' }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async values => {
      if (type === '0') {
        return await axiosClient.post(`/products/${id}?_method=put`, values)
      }

      return await axiosClient.post(`/articles/${id}?_method=put`, values)
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

export const useGetDetailArticles = ({ id, type = '1' }) => {
  return useQuery({
    queryKey: [`details-articles`, id],
    queryFn: async () => {
      if (type === '0') {
        return await axiosClient.get(`products/${id}`).then(res => res.data)
      }

      return await axiosClient.get(`articles/${id}`).then(res => res.data)
    },
    enabled: !!id
  })
}

export const useGetTypeArticles = () => {
  return useQuery({
    queryKey: [`types-articles`],
    queryFn: () => axiosClient.get(`article-types`).then(res => res.data)
  })
}

export function useEnableArticles({ id, type = '1' }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      if (type === '0') {
        return await axiosClient.put(`products/${id}/enable`)
      }

      return await axiosClient.put(`articles/${id}/enable`)
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

export function useDisabledArticles({ id, type = '1' }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      if (type === '0') {
        return await axiosClient.put(`products/${id}/disable`)
      }

      return axiosClient.put(`articles/${id}/disable`)
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

export function useValidateArticles({ id, type = '1' }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      if (type === '0') {
        return axiosClient.put(`products/${id}/validate`)
      }

      return axiosClient.put(`articles/${id}/validate`)
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

export function useToggleAccessArticles({ id, type = '1' }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      if (type === '0') {
        return await axiosClient.put(`products/${id}/toggle-access
        `)
      }

      return await axiosClient.put(`articles/${id}/toggle-access`)
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

export function useDeleteArticle() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ id, type = 1 }) => {
      if (type === '0') {
        return await axiosClient.delete(`products/${id}`)
      }

      return axiosClient.delete(`articles/${id}`)
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

export function useGetScaleList() {
  return useQuery({
    queryKey: ['scale-list'],
    queryFn: () => axiosClient.get(`scales`).then(res => res.data)
  })
}

export function useGetCategoriesList() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => axiosClient.get(`categories`).then(res => res.data)
  })
}

export function useGetSubCategoriesList() {
  return useQuery({
    queryKey: ['sub-categories'],
    queryFn: () => axiosClient.get(`sub-categories`).then(res => res.data)
  })
}

export function useGetTVAList() {
  return useQuery({
    queryKey: ['tvas'],
    queryFn: () => axiosClient.get(`tvas`).then(res => res.data)
  })
}
