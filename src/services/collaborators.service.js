import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetCollaborators = ({
  debouncedSearchTerm = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  clientId,
  state,
  type,
  companyId = false
}) => {
  return useQuery({
    queryKey: ['collaborators', debouncedSearchTerm, page, pageSize, state, companyId],
    queryFn: () =>
      axiosClient
        .get(
          `companies/users?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${
            state ? `&state=${state}` : ''
          }${paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''}${
            companyId !== false ? `&companyId=${companyId}` : ''
          }`
        )
        .then(res => res.data)
  })
}

export function useCreateCollaborator() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/collaborators`, values)
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

export function useUpdateCollaborators({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/companies/users/${id}?_method=put`, values)
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

export const useGetCompaniesByRole = ({ role }) => {
  return useQuery({
    queryKey: ['companies-by-role', role],
    queryFn: () => axiosClient.get(`/companies/all?${role ? `type=${role}` : ''}`).then(res => res.data)
  })
}

export const useGetDetailCollaborators = ({ id, type }) => {
  return useQuery({
    queryKey: [`details-collaborators-${id}`],
    queryFn: () => axiosClient.get(`/companies/users/${id}`).then(res => res.data)
  })
}

export function useDeleteCollaborator() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`collaborators/${id}`)
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

export function useDisabledCollaborator() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.put(`collaborators/${id}/disable`)
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

export function useUploadDocumentForCollaborator({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/collaborators/${id}/documents`, values)
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

export function useDeleteDocumentCollab() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`collaborator-documents/${id}`)
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

export function useDeleteDocumentCollabSpecificVersion() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`collaborator-document-versions/${id}`)
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

export const useGetCompaniesInspectors = () => {
  return useQuery({
    queryKey: ['companies-inspectors'],
    queryFn: () => axiosClient.get(`companies/users/inspectors`).then(res => res.data)
  })
}
