import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import axiosClient from 'src/axiosClient'
import { toQueryString } from 'src/@core/utils/helpers'

export const useGetRootCompanies = paginator => {
  return useQuery({
    queryKey: ['companies-root', { paginator }],
    queryFn: () => axiosClient.get(toQueryString('root/companies', paginator)).then(res => res.data)
  })
}

export const useGetAllMars = () => {
  return useQuery({
    queryKey: 'mars',
    queryFn: () => axiosClient.get('root/allMars').then(res => res.data)
  })
}

export const useUpdateMarSelfCheckIn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['update-mar-self-check-in'],
    mutationFn: ({ id, selfCheckIn }) => axiosClient.put(`root/selfCheckIn`, { selfCheckIn, companyId: id }),
    onSuccess: () => {
      toast.success('Entreprise mise à jour avec succès')
      queryClient.invalidateQueries({
        queryKey: ['companies-root']
      })
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de l'entreprise")
    }
  })
}
