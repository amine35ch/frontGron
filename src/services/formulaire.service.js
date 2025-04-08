import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetFormulaireForProject = ({ id, document }) => {
  return useQuery({
    queryKey: ['formulaire', id],
    queryFn: () => axiosClient.get(`/form/${id}/${document}`).then(res => res.data)
  })
}

export function usePostFormulaireForProject({ id, document }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/form/${id}/${document}`, values)
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

export function useStoreImage() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/form/${id}/store-image`, values)
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

export function useDeleteImage() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.delete(`form/${id}/remove-image`, values)
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

export function useFinishForm({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: idDocument => {
      return axiosClient.put(`/form/finish/${id}/${idDocument}`)
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

export function useFinishFicheNavette({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: idDocument => {
      return axiosClient.put(`/document-questions/finish/${id}/${idDocument}`)
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

export function useGenerateFicheNavette({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: idDocument => {
      return axiosClient.post(`/document-questions/generate/${id}/${idDocument}`)
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

export function useGenerateForm({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: idDocument => {
      return axiosClient.post(`/form/generate/${id}/${idDocument}`)
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
