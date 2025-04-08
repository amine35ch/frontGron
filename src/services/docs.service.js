import { useQuery } from '@tanstack/react-query';
import axiosClient from 'src/axiosClient';

export const useGetDocsData = () => {
  return useQuery({
    queryKey: ['docsData'],
    queryFn: () => axiosClient.get('/dashboard-statics/projects').then((res) => res.data),
  });
};