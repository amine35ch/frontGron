import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'
import { toQueryString } from 'src/@core/utils/helpers'

export const useGetListCompany = ({
  debouncedSearchTerm = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  type,
  audit,
  state,
  operations,
  profile,
  id,
  role,
  display = false,
  identifiant
}) => {
  return useQuery({
    queryKey: [
      `companies-${profile}`,
      display,
      debouncedSearchTerm,
      page,
      pageSize,
      audit,
      state,
      operations,
      type,
      profile,
      role,
      identifiant
    ],
    queryFn: () =>
      axiosClient
        .get(
          `companies/${profile ? `${profile}` : ''}?${debouncedSearchTerm ? `&search=${debouncedSearchTerm}` : ''}${
            state ? `&state=${state}` : ''
          }${role ? `&role=${role}` : ''}${display ? `&display=${display}` : ''}${
            identifiant ? `&auth=${identifiant}` : ''
          }${operations ? `&operations=${operations}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }`
        )
        .then(res => res.data)
  })
}

export const useGetAllListCompanyCollaborator = () => {
  return useQuery({
    queryKey: ['companies-collaborator'],
    queryFn: () => axiosClient.get(`/companies/users/collaborator?${`state=1`}`).then(res => res.data)
  })
}

export function useCreateCompany({ profile }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/companies/${profile}/${values.role ? values.role : ''}`, values)
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

export function useCreateCompanyUser({ profile, id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/companies/${profile}/${id}/users`, values)
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

export function useUpdateCompany({ id, profile }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/companies/${profile}/${id}?_method=put`, values)
    },

    onSuccess: async data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries()
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useGenerateLinkCompany() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/companies/linkGeneration?_method=put`, values)
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

export function useUpdateCompanyUser({ id, profile }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/companies/${profile}/${id}/users?_method=put`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({
        queryKey: []
      })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export const useGetDetailCompany = ({ id, profile }) => {
  return useQuery({
    queryKey: [`details-company`, id],
    queryFn: () => axiosClient.get(`companies/${profile}/${id}`).then(res => res.data)
  })
}

export const useGetCompanyProfileDetails = () => {
  return useQuery({
    queryKey: [`profile-details-company`],
    queryFn: () => axiosClient.get(`/settings/company`).then(res => res.data)
  })
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: formData => {
      return axiosClient.post(`/settings/company?_method=put`, formData)
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

export function useDeleteCompany({ profile }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`companies/${profile}/${id}`)
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

export function useDeleteCompanyUser({ profile }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`companies/${profile}/${id}/delete`)
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

export const useGetListCompanyUser = ({ search = '', paginated = false, pageSize = 10, page = 1 }) => {
  return useQuery({
    queryKey: ['company-user', search, page, pageSize],
    queryFn: () => axiosClient.get(`company-users`).then(res => res.data)
  })
}

export function useDisabledCompany({ profile }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.put(`companies/${profile}/${id}/disable`)
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

export const useGetCurrentPiece = () => {
  return useQuery({
    queryKey: ['current-pieces'],
    queryFn: () => axiosClient.get(`settings/current-pieces`).then(res => res.data),
    staleTime: 0
  })
}

export function useUpdateCurrentPieces() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: formData => {
      return axiosClient.post(`/settings/current-pieces?_method=put`, formData)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({
        queryKey: ['current-pieces']
      })
    },

    onError: () => {
      toast.error('Une erreur est survenue')
    }
  })

  return mutation
}

export const useGetListQualification = ({ type }) => {
  return useQuery({
    queryKey: [`qualifications-${type}`],
    queryFn: () => axiosClient.get(`qualifications/?${type ? `&type=${type}` : ''}`).then(res => res.data)
  })
}

export const useGetAllMarsForCompanie = () => {
  return useQuery({
    queryKey: ['companies-collaborator'],
    queryFn: () => axiosClient.get(`/companies/getMars`).then(res => res.data)
  })
}

export function useSetMarForCompanies() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: value => {
      return axiosClient.patch(`/companies/setMar?_method=patch`, value)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['profile-details-company'] })
    }
  })

  return mutation
}

export function useImportUser({ identifier }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: value => {
      return axiosClient.post(`/companies/${identifier}/import`, value)
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

export const useGetCompanyPreview = ({ siret = '', identifier = '' }) => {
  return useQuery({
    queryKey: ['companies-preview', siret],
    queryFn: () => axiosClient.get(`/companies/${identifier}/preview-import/${siret}`).then(res => res.data),
    enabled: !!siret
  })
}

export const useGetEmails = paginator => {
  return useQuery({
    queryKey: ['company-emails', { paginator }],
    queryFn: () => axiosClient.get(toQueryString('settings/mailings', paginator)).then(res => res.data)
  })
}

export const useEnableOrDisableEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['enable-disable-email'],
    mutationFn: ({ id, status }) =>
      axiosClient.put(`settings/mailings/${id}`, {
        status: Number(status) === 1 ? 0 : 1
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-emails']
      })
    }
  })
}

export const useEnableOrDisablePlatform = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['enable-disable-platform'],
    mutationFn: ({ id, statusWeb }) =>
      axiosClient.put(`settings/mailings/${id}`, {
        statusWeb: Number(statusWeb) === 1 ? 0 : 1
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-emails'] 
      })
    }
  })
}
