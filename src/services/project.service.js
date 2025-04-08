import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetListProject = ({
  debouncedSearchTerm,
  paginated = false,
  pageSize = 10,
  page = 1,
  type,
  state = false,
  incomeClass = false,
  entrepriseRetenu,
  step,
  auditor,
  dateRange,
  projectType
}) => {
  return useQuery({
    queryKey: [
      `list-project`,
      step,
      auditor,
      debouncedSearchTerm,
      page,
      pageSize,
      type,
      state,
      incomeClass,
      entrepriseRetenu,
      dateRange
    ],
    queryFn: () =>
      axiosClient
        .get(
          `projects?${projectType === 0 ? 'project_type=0&' : 'project_type=1&'}${
            state !== false ? `state=${state}&` : ''
          }${type ? `type=${type}&` : ''}${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }${incomeClass !== false ? `&class=${incomeClass}` : ''}${
            entrepriseRetenu ? `&entreprise=${entrepriseRetenu}` : ''
          }${step ? `&step=${step}` : ''}${auditor ? `&auditor=${auditor}` : ''}${
            dateRange ? `&dateRange=${dateRange}` : ''
          }`
        )
        .then(res => res.data)
  })
}

export const useGetProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => axiosClient.get('/projects').then(res => res.data)
  })
}

export const useGetProjectVisitForProjects = ({
  search = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  clientId,
  state,
  type,
  id
}) => {
  return useQuery({
    queryKey: ['list-project-visits-for-project', search, page, pageSize],
    queryFn: () =>
      axiosClient
        .get(
          `projects/${id}/visits?${search ? `search=${search}` : ''}${state ? `state=${state}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }`
        )
        .then(res => res.data)
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/projects`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      // queryClient.invalidateQueries()
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateProject({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/projects/${id}?_method=put`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateProjectState() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, state }) => {
      return axiosClient.post(`/projects/${id}/update-state?_method=patch`, { state })
    },
    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: error => {
      toast.error(error?.response?.data?.message)
    }
  })

  return mutation
}

export function useDecideEndProject({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/projects/${id}/decision-end?_method=put`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export const useGetDetailProject = ({ id, type }) => {
  return useQuery({
    queryKey: [`details-Project`, id],
    queryFn: () => axiosClient.get(`projects/${id}${type ? `?type=1` : ''}`).then(res => res.data),
    staleTime: 5 * (60 * 1000),
    cacheTime: 10 * (60 * 1000)
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`projects/${id}`)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['list-project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

// ***** other apis party

export const useGetListTypeDemade = () => {
  return useQuery({
    queryKey: ['type-demandes'],
    queryFn: () => axiosClient.get(`type-demandes`).then(res => res.data)
  })
}

export const useGetListIncomeClasses = () => {
  return useQuery({
    queryKey: ['income-classes'],
    queryFn: () => axiosClient.get(`income-classes`).then(res => res.data)
  })
}

export const useGetListEnergyClasses = () => {
  return useQuery({
    queryKey: ['energy-classes'],
    queryFn: () => axiosClient.get(`energy-classes`).then(res => res.data)
  })
}

export const useGetListProjectResidences = () => {
  return useQuery({
    queryKey: ['project-residences'],
    queryFn: () => axiosClient.get(`project-residences`).then(res => res.data)
  })
}

export const useGetListProjectNatures = () => {
  return useQuery({
    queryKey: ['project-natures'],
    queryFn: () => axiosClient.get(`project-natures`).then(res => res.data)
  })
}

export const useGetListTypeProject = () => {
  return useQuery({
    queryKey: ['project-type'],
    queryFn: () => axiosClient.get(`project-types`).then(res => res.data)
  })
}

export const useGetListStepsForProject = ({ id }) => {
  return useQuery({
    queryKey: ['list-steps-project'],
    queryFn: () => axiosClient.get(`projects/${id}/steps`).then(res => res.data)
  })
}

// apis stepperrr

export function useCreateStepOneDecision({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/${id}/qualification`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      // queryClient.invalidateQueries()
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useGenerateDocument({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: document => {
      return axiosClient.post(`/projects/${id}/${document.reference}/generate-document/${document.id}`)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUploadDocumentToProject({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      const { formData, idDocument } = values

      return axiosClient.post(`/projects/${id}/documents/${idDocument}`, formData)
    },
    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUploadDocumentInstaller() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      const { formData, idDocument } = values

      return axiosClient.post(`/projects/installer/documents/${idDocument}`, formData)
    },
    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUploadGeneralDocumentToProject({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/projects/${id}/any-documents/`, values)
    },
    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useSubmitSimulation({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      const { data, hasInstaller } = values

      return axiosClient.put(`/projects/${id}/simulation?has_installer=${hasInstaller}`, data)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useValidatorInstallor({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/${id}/set-installer-operations?_method=put`, values)
    },
    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useDeleteDocumentProject() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`project-documents/${id}`)
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

export function useDeleteDocumentProjectSpecificVersion() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`project-document-versions/${id}`)
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

export const useGetProjectInvoiceByType = ({ id, type }) => {
  return useQuery({
    queryKey: ['project-invoice-type', id],
    queryFn: () => axiosClient.get(`projects/${id}/invoices/${type}`).then(res => res.data)
  })
}

export const useGetProjectInvoiceInstaller = ({ id }) => {
  return useQuery({
    queryKey: ['project-invoice-installer', id],
    queryFn: () => axiosClient.get(`projects/${id}/invoicesInstaller`).then(res => res.data)
  })
}

export const useGetProjectInvoice = ({ id }) => {
  return useQuery({
    queryKey: ['project-invoice', id],
    queryFn: () => axiosClient.get(`projects/${id}/invoices`).then(res => res.data)
  })
}

export const useGetListVisitors = () => {
  return useQuery({
    queryKey: ['list-visitors'],
    queryFn: () => axiosClient.get(`project-visits/list-visitors`).then(res => res.data)
  })
}

export const useUpdateProjectInvoice = ({ id }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ invoiceId, ...values }) => {
      return axiosClient.put(`projects/${id}/invoices/${invoiceId}?_method=put`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['project-invoice'] })
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

// export const useGetProjectInvoice = () => {
//   return useQuery({
//     queryKey: ['project-invoice', id],
//     queryFn: () => axiosClient.get(`project-visits/list-visitors`).then(res => res.data)
//   })
// }

export const useValidateInvoiceMutation = ({ id }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`projects/${id}/invoices-validation?_method=put`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['project-invoice'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export const useAddProjectEventMutation = ({ id }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/project-events`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export const useAddParoiMotifMutation = ({ id }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`projects/${id}/criteria`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export const useUpdateModalityRestMutation = ({ id }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`projects/${id}/rest-payment-modality`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export const useUpdateProjectCerfaMutation = ({ id }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`projects/${id}/cerfa?_method=put`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export const useGetProjectCompanies = ({ id }) => {
  return useQuery({
    queryKey: ['project-companies'],
    queryFn: () => axiosClient.get(`projects/${id}/companies`).then(res => res.data)
  })
}

export const useUpdateProjectOperation = ({ id }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`projects/${id}/update-operations?_method=put`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
      queryClient.invalidateQueries({ queryKey: ['project-companies'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export const useUpdateProjectAgent = ({ id }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`projects/${id}/update-agent-operations?_method=put`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useCreateWorkQuotion({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/projects/${id}/work-quotation?_method=put`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })

      // queryClient.invalidateQueries({ queryKey: ['project-invoice-installer'] })
      // queryClient.invalidateQueries('details-Project', 'project-invoice-installer')

      // queryClient.invalidateQueries()
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useDeleteWorkQuotion() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      return axiosClient.delete(`/projects/work-quotation/${id}`)
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

export function useValidateWorkDevis() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ invoiceId }) => {
      return axiosClient.put(`/projects/work/validate-facture/${invoiceId}`)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      // queryClient.invalidateQueries('details-Project')
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useCancelWorkDevis() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ invoiceId }) => {
      return axiosClient.put(`/projects/work/cancel-facture/${invoiceId}`)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      // queryClient.invalidateQueries('details-Project')
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateProjectStatus({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/projects/${id}/update-status?_method=put`, values)
    },

    onSuccess: data => {
      // toast.success(data?.data?.message)
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateDepotAnah({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.patch(`/projects/${id}/depot-anah`, values)
    },

    onSuccess: data => {
      // toast.success(data?.data?.message)
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateProjectInvoiceBilling({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/projects/${id}/invoice-amount?_method=put`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['project-invoice'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function usePatchCurrentStep({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.patch(`/projects/${id}/current-step`, values)
    },

    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateProjectPrevWorkDate({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/projects/${id}/update-work-dates?_method=put`, values)
    },

    onSuccess: data => {
      // toast.success(data?.data?.message)
      // queryClient.invalidateQueries({ queryKey: ['project-invoice'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useUpdateWorkDatesProject({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/${id}/update-work-dates`, values)
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

// invoice
export const useGetListPaymentTracking = ({ debouncedSearchTerm, paginated = false, pageSize = 10, page = 1 }) => {
  return useQuery({
    queryKey: [`invoices`, debouncedSearchTerm, page, pageSize],
    queryFn: () =>
      axiosClient
        .get(
          `/projects/all-invoices?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }`
        )
        .then(res => res.data)
  })
}

export function useExportListProject() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      return axiosClient.get(`/projects/export`)
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

export const useGetRefInvoice = ({ installerId }) => {
  return useQuery({
    queryKey: ['ref-invoice', installerId],
    queryFn: () => axiosClient.get(`${installerId}/reference`).then(res => res.data)
  })
}

export function useSentDocumentForSignature({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ fileType, contactInfo }) => {
      return axiosClient.put(`/projects/${id}/${fileType}/send`, contactInfo)
    },
    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: error => {
      // if (error?.response?.status === 429) {
      //   toast.error(error?.response?.data?.errors?.message)
      // } else {
      //   toast.error(error?.response?.data?.message)
      // }
    }
  })

  return mutation
}

export function useValidateDevis({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/${id}/validate-facture`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      // queryClient.invalidateQueries('details-Project')
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useVerifyInvoice({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/${id}/cancel-facture`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['project-installer-invoice-comments'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useSubmitGeneralInformation({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/${id}/general-information`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useSendAnahFolder({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/${id}/anah_folder`, values)
    },
    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: error => {
      toast.error(error?.response?.data?.message)
    }
  })

  return mutation
}

export function useMergeAgent({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.patch(`/projects/${id}/merge_agent  `, values)
    },
    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: error => {
      toast.error(error?.response?.data?.message)
    }
  })

  return mutation
}

export const useGetProjectsCreationDocuments = () => {
  return useQuery({
    queryKey: ['projects-creation-documents'],
    queryFn: () => axiosClient.get('/projects/creation-documents').then(res => res.data)
  })
}

export const useGetProjectInstallerInvoiceComments = ({ id }) => {
  return useQuery({
    queryKey: ['project-installer-invoice-comments', id],
    queryFn: () => axiosClient.get(`projects/${id}/invoice-comments`).then(res => res.data)
  })
}

export function useSetAnahResponse({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/${id}/anah-response`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['details-Project'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useMarkCommentAsSeen() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.put(`/projects/${values}/trait-comment `)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)

      queryClient.invalidateQueries({ queryKey: ['project-installer-invoice-comments'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export const useAddCommentToProject = ({ id }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationKey: ['add-comment-to-project'],
    mutationFn: values => axiosClient.post(`projects/anah/comments/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-comments', { id }] })
    }
  })

  return mutation
}

export const useGetProjectComments = ({ id }) => {
  const query = useQuery({
    queryKey: ['project-comments', { id }],
    queryFn: () => axiosClient.get(`projects/anah/comments/${id}`).then(res => res.data),
    staleTime: 5 * (60 * 1000)
  })

  return query
}

export const useUpdateProjectAnahResponse = ({ id }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationKey: ['update-project-anah-response', { id }],
    mutationFn: async () => await axiosClient.put(`projects/${id}/second-depot-anah`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`details-Project`] })
      toast.success('La réponse a été envoyée avec succès')
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de l'envoi de la réponse")
    }
  })

  return mutation
}
