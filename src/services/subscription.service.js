import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetSubscriptionInvoices = ({
  paginated = false,
  pageSize = 10,
  page = 1,
  debouncedSearchTerm,
  userId,
  state
}) => {
  return useQuery({
    queryKey: ['subscription-invoices', page, pageSize, debouncedSearchTerm, userId, state],

    queryFn: () =>
      axiosClient
        .get(
          `subscription/invoices?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }${state ? `&state=${state}` : ''}`
        )
        .then(res => res.data)
  })
}

export const useGetAllPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans'],

    queryFn: () => axiosClient.get(`subscription/plans`).then(res => res.data)
  })
}

export const useGetPlanPaymentTypes = () => {
  return useQuery({
    queryKey: ['plan-payment-types'],

    queryFn: () => axiosClient.get(`subscription/plan-payment-types`).then(res => res.data)
  })
}

export const useGetPaymentMethods = () => {
  return useQuery({
    queryKey: ['p-payment-methods'],

    queryFn: () => axiosClient.get(`subscription/p-payment-methods`).then(res => res.data)
  })
}

export function useStoreCompanyPlan() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/store-company-plan`, values)
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

export const useGetAllPaymentMethodesByCompany = () => {
  return useQuery({
    queryKey: ['payment-methods'],

    queryFn: () => axiosClient.get(`subscription/payment-methods`).then(res => res.data)
  })
}

export const useGetAllPaymentMethodesByPaymentId = ({ id }) => {
  return useQuery({
    queryKey: ['payment-methods', id],

    queryFn: () => axiosClient.get(`subscription/payment-methods/${id}`).then(res => res.data)
  })
}

export function useStorePaymentMethod() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`subscription/payment-methods`, values)
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

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/payment-methods?_method=put`, values)
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

export const useGetFeatures = () => {
  return useQuery({
    queryKey: ['payment-features'],

    queryFn: () => axiosClient.get(`/p-features`).then(res => res.data)
  })
}

export function useUpdateFeatures() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/update-feature?_method=put`, values)
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

export const useGetSubscriberSubscription = () => {
  return useQuery({
    queryKey: ['subscriber-subscription'],

    queryFn: () => axiosClient.get(`/subscription/subscriber-subscription`).then(res => res.data)
  })
}

export const useGetSubscriberFeature = () => {
  return useQuery({
    queryKey: ['payment-methods'],

    queryFn: () => axiosClient.get(`/p-features`).then(res => res.data)
  })
}

export const useGetSubscriberFeatures = () => {
  return useQuery({
    queryKey: ['subscriber-features'],

    queryFn: () => axiosClient.get(`/subscription/subscriber-features`).then(res => res.data)
  })
}

export const useGetSubscriberFeaturesUnit = ({ id }) => {
  return useQuery({
    queryKey: ['subscriber-features-unit', id],

    queryFn: () => axiosClient.get(`/subscription/feature/units/${id}`).then(res => res.data)
  })
}

export const useGetPercentageSubscriberFeatures = () => {
  return useQuery({
    queryKey: ['percentage-subscriber-features'],

    queryFn: () => axiosClient.get(`/subscription/percentage-subscriber-features`).then(res => res.data)
  })
}

export function useSendUnpayedProjects() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`subscription/send-unpayed-projects`, values)
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

export function useValidateInvoice() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`subscription/validate-invoice?_method=put`, values)
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

export const useGetDetailsSubscriptionInvoices = ({ id }) => {
  return useQuery({
    queryKey: ['details-invoices', id],

    queryFn: () => axiosClient.get(`subscription/invoice/${id}`).then(res => res.data)
  })
}

export function useAddProjectToInvoice() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ invoiceId, projectID }) => {
      return axiosClient.put(`subscription/${invoiceId}/${projectID}/add-project`)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['details-invoices'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export function useRemoveProjectFromInvoice() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ invoiceId, lineId }) => {
      return axiosClient.put(`subscription/${invoiceId}/${lineId}/remove-project`)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries()
    },
    onError: data => {
      toast.error(data?.response?.data?.data?.message)
    }
  })

  return mutation
}

export function useCancelInvoice() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: value => {
      return axiosClient.put(`subscription/cancel-invoice`, value)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['subscription-invoices'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export const useGetSubscriberFeaturesExtra = ({
  paginated = false,
  pageSize = 10,
  page = 1,
  debouncedSearchTerm,
  state
}) => {
  return useQuery({
    queryKey: ['subscriber-features-extra', paginated, pageSize, page, debouncedSearchTerm, state],

    queryFn: () =>
      axiosClient
        .get(
          `/subscription/subscriber-features-extra?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }${state ? `&active=${state}` : ''}`
        )
        .then(res => res.data)
  })
}

export function useRemoveFeatures() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: value => {
      return axiosClient.post(`subscription/remove-feature`, value)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['subscriber-features-extra'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.data?.message)
    }
  })

  return mutation
}

export const useGetFeaturesExtra = () => {
  return useQuery({
    queryKey: ['subscriber-features-extra'],

    queryFn: () => axiosClient.get(`subscription/subscriber-features-extra`).then(res => res.data)
  })
}

export function useAddFeatures() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: value => {
      return axiosClient.post(`subscription/add-feature`, value)
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

export function useUpdatePlan() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: value => {
      return axiosClient.post(`subscription/update-plan?_method=put`, value)
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
