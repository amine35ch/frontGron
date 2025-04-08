import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetTiers = ({
  debouncedSearchTerm = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  type,
  audit,
  state,
  operations,
  entreprise
}) => {
  return useQuery({
    queryKey: ['Tiers', debouncedSearchTerm, page, pageSize, audit, state, operations, entreprise],
    queryFn: () =>
      axiosClient
        .get(
          `third-parties?${type ? `type=${type}` : ''}${audit ? `&audit=${audit}` : ''}${
            operations ? `&operation=${operations}` : ''
          }${entreprise ? `&entreprise=${entreprise}` : ''}${state ? `&state=${state}` : ''}${
            debouncedSearchTerm ? `&search=${debouncedSearchTerm}` : ''
          }${paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''}`
        )
        .then(res => res.data)
  })
}

export const useGetEntreprise = ({
  debouncedSearchTerm = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  type,
  audit,
  state,
  operations,
  entreprise
}) => {
  return useQuery({
    queryKey: ['entreprise', debouncedSearchTerm, page, pageSize, audit, state, operations, entreprise],
    queryFn: () =>
      axiosClient
        .get(
          `third-parties?${type ? `type=${type}` : ''}${audit ? `&audit=${audit}` : ''}${
            operations ? `&operation=${operations}` : ''
          }${entreprise ? `&entreprise=${entreprise}` : ''}${state ? `&state=${state}` : ''}${
            debouncedSearchTerm ? `&search=${debouncedSearchTerm}` : ''
          }${paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''}`
        )
        .then(res => res.data)
  })
}

export function useCreateTiers() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/third-parties`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['Tiers'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateTiers({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/companies/sub-contractors/${id}/disable?_method=put`, values)
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

export const useGetDetailTiers = ({ id, type }) => {
  return useQuery({
    queryKey: [`details-Tiers-${id}`],
    queryFn: () => axiosClient.get(`third-parties/${id}${type ? `?type=1` : ''}`).then(res => res.data)
  })
}

export function useDeleteTiers() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`third-parties/${id}`)
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

export function useDisabledTiers() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.put(`/companies/installers/${id}/disable`)
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

export const useGetTypeTiers = () => {
  return useQuery({
    queryKey: ['type-tiers'],
    queryFn: () => axiosClient.get(`type-third-parties`).then(res => res.data)
  })
}

export const useGetOperationTiers = ({ id }) => {
  return useQuery({
    queryKey: ['operation-tiers', id],
    queryFn: () => axiosClient.get(`third-parties/${id}/operations`).then(res => res.data),
    enabled: !!id
  })
}

export function useUploadDocumentForCompany({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/companies/documents/${id}`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['details-company'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUploadDocumentForProfileCompany() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/companies/documents/`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['profile-details-company'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useDeleteDocumentForCompany() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`company-documents/${id}`)
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

export function useDeleteDocumentCompanySpecificVersion() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`company-document-versions/${id}`)
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
