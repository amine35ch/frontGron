import { useQuery } from '@tanstack/react-query';
import axiosClient from 'src/axiosClient';

export const useGetDevisData = () => {
  return useQuery({
    queryKey: ['devisData'],
    queryFn: () => axiosClient.get('/dashboard-statics/devis').then((res) => res.data),
  });
};