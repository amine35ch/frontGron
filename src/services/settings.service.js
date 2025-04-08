import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import axiosClient from 'src/axiosClient'

export const useGetListIncomeClasses = () => {
  return useQuery({
    queryKey: ['income-classes'],
    queryFn: () => axiosClient.get(`income-classes`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetDocumentTypes = () => {
  return useQuery({
    queryKey: ['document-types'],
    queryFn: () => axiosClient.get(`document-types`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetListEnergyClasses = () => {
  return useQuery({
    queryKey: ['energy-classes'],
    queryFn: () => axiosClient.get(`energy-classes`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetEnergyClasseSkips = () => {
  return useQuery({
    queryKey: ['energy-class-skips'],
    queryFn: () => axiosClient.get(`energy-class-skips`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetBonus = () => {
  return useQuery({
    queryKey: ['bonus'],
    queryFn: () => axiosClient.get(`bonus`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetUnitType = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: () => axiosClient.get(`/units`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetWorkType = () => {
  return useQuery({
    queryKey: ['work-types'],
    queryFn: () => axiosClient.get(`/work-types`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetNatureResidence = () => {
  return useQuery({
    queryKey: ['nature-residence'],
    queryFn: () => axiosClient.get(`/nature-residences`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetListProjectResidences = () => {
  return useQuery({
    queryKey: ['project-residences'],
    queryFn: () => axiosClient.get(`project-residences`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetListProjectNatures = () => {
  return useQuery({
    queryKey: ['project-natures'],
    queryFn: () => axiosClient.get(`project-natures`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetListTypeDemade = () => {
  return useQuery({
    queryKey: ['type-demandes'],
    queryFn: () => axiosClient.get(`type-demandes`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetRaisonTypes = () => {
  return useQuery({
    queryKey: ['raison-types'],
    queryFn: () => axiosClient.get(`raison-types`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetMarScales = () => {
  return useQuery({
    queryKey: ['mar-scales'],
    queryFn: () => axiosClient.get(`mar-scales`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 2000 * 60 * 60 * 24
  })
}

export const useGetLogs = ({
  paginated = true,
  pageSize = 10,
  page = 1,
  debouncedSearchTerm,
  startDateRange,
  endDateRange
}) => {
  return useQuery({
    queryKey: ['logs', paginated, pageSize, page, debouncedSearchTerm, startDateRange, endDateRange],
    queryFn: () =>
      axiosClient
        .get(
          `logs?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${
            startDateRange ? `date=${startDateRange}${endDateRange ? `,${endDateRange}` : ''}` : ''
          }${paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''}`
        )
        .then(res => res.data)
  })
}

export const useGetProjctDocuments = ({ signature = false }) => {
  // build query key
  /// query to pass

  return useQuery({
    queryKey: ['company-project-docs', signature],
    queryFn: () =>
      axiosClient.get(`settings/company-project-docs?${signature ? 'signature=1' : ''}`).then(res => res.data)
  })
}

export const useGetDocuments = () => {
  return useQuery({
    queryKey: ['settings-documents'],
    queryFn: () => axiosClient.get(`setting/documents`).then(res => res.data)
  })
}

export const useUpdateProjectDocuments = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => axiosClient.put(`settings/company-project-docs`, data),
    onSuccess: data => {},
    onError: data => {}
  })
}

export const useUpdateProjectDocumentsSignature = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => axiosClient.put(`settings/company-project-docs/signature`, data),
    onSuccess: data => {},
    onError: data => {}
  })
}

export const useGetRges = ({}) => {
  return useQuery({
    queryKey: ['rges'],
    queryFn: () => axiosClient.get(`rges`).then(res => res.data)
  })
}

export const useGetCompanyAvailableRoles = () => {
  return useQuery({
    queryKey: ['company-roles'],
    queryFn: () => axiosClient.get(`settings/company/roles`).then(res => res.data)
  })
}
