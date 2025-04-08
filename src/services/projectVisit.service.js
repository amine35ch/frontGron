import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetProjectVisit = ({
  search = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  clientId,
  state,
  type
}) => {
  return useQuery({
    queryKey: ['list-project-visits', search, page, pageSize],
    queryFn: () =>
      axiosClient
        .get(
          `project-visits?${search ? `search=${search}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }`
        )
        .then(res => res.data)
  })
}

export function useCreateProjectVisit({ toastAction = true, invalidateQueries = true }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/project-visits`, values)
    },

    onSuccess: data => {
      if (toastAction) toast.success(data?.data?.message)
      if (invalidateQueries) queryClient.invalidateQueries({ queryKey: ['details-Project'] })
      queryClient.invalidateQueries({ queryKey: ['list-project-visits-for-project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateProjectVisit() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/project-visits/${values?.id}?_method=put`, values?.data)
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

export const useGetDetailProjectVisit = ({ id, type }) => {
  return useQuery({
    queryKey: [`details-Project-visit-${id}`],
    queryFn: () => axiosClient.get(`project-visits/${id}${type ? `?type=1` : ''}`).then(res => res.data)
  })
}

export function useDeleteProjectVisit() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`project-visits/${id}`)
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

export const useGetTypeProjectVisit = () => {
  return useQuery({
    queryKey: ['type-project-visits'],
    queryFn: () => axiosClient.get(`type-visits`).then(res => res.data)
  })
}

export function useUpdateDecisionProjectVisit() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/project-visits/${values.id}/validation`, values.data)
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

export function useTerminateProjectVisit() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: id => {
      return axiosClient.patch(`/project-visits/${id}/finish-visit`)
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

// export const useGetCompaniesUsersSuperviseurInspecteur = ({ id, type }) => {
//   return useQuery({
//     queryKey: [`companies/users/superviseur-inspecteur`],
//     queryFn: () => axiosClient.get(`companies/users/superviseur-inspecteur`).then(res => res.data)
//   })
// }

export const useGetCompaniesUsersSuperviseurInspecteur = ({
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
      `companies/users/superviseur-inspecteur`,
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
          `companies/users/superviseur-inspecteur/?${debouncedSearchTerm ? `&search=${debouncedSearchTerm}` : ''}${
            state ? `&state=${state}` : ''
          }${role ? `&role=${role}` : ''}${operations ? `&operations=${operations}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }`
        )
        .then(res => res.data)
  })
}
