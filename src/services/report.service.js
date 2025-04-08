import { useQuery } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'

export const useGetAnnualReportData = () => {
  return useQuery({
    queryKey: ['annualReportData'],
    queryFn: () => axiosClient.get('/dashboard-statics/devis-projet-visits').then(res => res.data)
  })
}
