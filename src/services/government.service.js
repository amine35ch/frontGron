import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetGovernmentUsers = ({
  search = '',
  paginated = false,
  pageSize = 10,
  page = 1,
  state,
  type,
  debouncedSearchTerm
}) => {
  return useQuery({
    queryKey: ['governmentUsers', page, pageSize, state, type, debouncedSearchTerm],

    queryFn: () =>
      axiosClient
        .get(
          `/governments/users?${debouncedSearchTerm ? `search=${debouncedSearchTerm}` : ''}${
            state ? `&state=${state}` : ''
          }${type ? `&type=${type}` : ''}${
            paginated !== false ? `&paginated=true&page=${page}&page_size=${pageSize}` : ''
          }`
        )
        .then(res => res.data)
  })
}

export function useUpdateGovernmentUser({ id }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: values => {
      return axiosClient.post(`/governments/users/${id}?_method=put`, values)
    },

    onSuccess: data => {
      toast.success(data?.data?.message)
      queryClient.invalidateQueries({ queryKey: ['governmentUsers'] })
    },
    onError: data => {
      toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}

export const useGetDetailGovernmentUser = ({ id }) => {
  return useQuery({
    queryKey: [`details-government-users-${id}`],
    queryFn: () => axiosClient.get(`/governments/users/${id}`).then(res => res.data)
  })
}


export function useCreateGovernmentUser() {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: values => {
        return axiosClient.post(`/governments/users`, values);
      },
  
      onSuccess: data => {
        toast.success(data?.data?.message);
        queryClient.invalidateQueries({ queryKey: ['governmentUsers'] });
      },
      onError: data => {
        toast.error(data?.response?.data?.message);
      }
    });
  
    return mutation;
  }
