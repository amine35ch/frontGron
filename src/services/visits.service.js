import { useQuery } from '@tanstack/react-query';
import axiosClient from 'src/axiosClient';

export const useGetVisitsData = () => {
  return useQuery({
    queryKey: ['visitsData'],
    queryFn: () => axiosClient.get('/dashboard-statics/visits').then((res) => res.data),
  });
};