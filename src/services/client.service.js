import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetClients = ({
  search = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  state,
  type,
  debouncedSearchTerm,
  clientType
}) => {
  return useQuery({
    queryKey: ['clients', page, pageSize, state, type, debouncedSearchTerm],

    queryFn: () =>
      axiosClient
        .get(
          `clients${clientType === 1 ? '/prospects' : clientType === 0 ? '/accepted' : ''}?${
            debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''
          }${state ? `&state=${state}` : ''}${type ? `&type=${type}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }`
        )
        .then(res => res.data)
  })
}

// TODO: Add Pagination later
export const useGetAcceptedClients = () => {
  return useQuery({
    queryKey: ['accepted-clients'],
    queryFn: () => axiosClient.get('clients/accepted').then(res => res.data)
  })
}

export const useGetClientsProspects = ({
  search = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  state,
  type,
  debouncedSearchTerm
}) => {
  return useQuery({
    queryKey: ['clients', page, pageSize, state, type, debouncedSearchTerm],

    queryFn: () =>
      axiosClient
        .get(
          `clients/prospects?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${
            state ? `&state=${state}` : ''
          }${type ? `&type=${type}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }`
        )
        .then(res => res.data)
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/clients`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateClient({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/clients/${id}?_method=put`, values)
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

export function useUpdateClientContactInfo({ id }) {
  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/clients/${id}/contact-info?_method=put`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export const useGetDetailClient = ({ id, type }) => {
  return useQuery({
    queryKey: [`details-clients-${id}`],
    queryFn: () => axiosClient.get(`clients/${id}${type ? `?type=1` : ''}`).then(res => res.data)
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`clients/${id}`)
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

export function useDisabledClient() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.put(`clients/${id}/disable`)
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

// *****

export const useGetTypeClients = () => {
  return useQuery({
    queryKey: ['type-clients'],
    queryFn: () => axiosClient.get(`type-clients`).then(res => res.data)
  })
}

export function useUpdateTypeClients() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/clients/accepted/${values?.id}`, values)
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

export function useRefuseypeProject() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/refused/${values?.id}`, values)
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

export function useUpdateTypeProject() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/accepted/${values?.id}`, values)
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

export function useUploadDocumentForClient({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/clients/${id}/documents`, values)
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

export function useDeleteDocumentClient() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`client-documents/${id}`)
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

export function useDeleteDocumentClientSpecificVersion() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`client-document-versions/${id}`)
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

export function useUpdateClientRibIban() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }) => {
      return axiosClient.put(`clients/${id}/rib-iban`, data)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      // queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useExportListClients() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      return axiosClient.get(`/clients/export`)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}
