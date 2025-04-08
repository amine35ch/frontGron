import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

// export const useGetNotifications = () => {
//   return useQuery({
//     queryKey: ['notifications'],
//     queryFn: () => axiosClient.get('/notifications').then(res => res.data)
//   })
// }

export const useGetNotifications = (perPage = 10) => {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosClient.get(`/notifications?paginated=true&page=${pageParam}&per_page=${perPage}`)

      return response.data
    },
    refetchInterval: 5000,
    getNextPageParam: lastPage => (lastPage.last_page > lastPage.current_page ? lastPage.current_page + 1 : null)
  })
}

export const useGetNewNotificationsCount = () => {
  return useQuery({
    queryKey: ['count-all'],
    queryFn: () => axiosClient.get('/notifications/count-all').then(res => res.data),
    refetchInterval: 5000
  })
}

export function useMarkAllNotificationsAsSeen() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosClient.put(`/notifications/all-seen`)
        queryClient.invalidateQueries({ queryKey: ['notifications'] })

        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to mark all notifications as seen')
      }
    }

    // onSuccess: data => {
    //   toast.success('toutes les notifications ont été marquées comme lues')
    //   queryClient.invalidateQueries('notifications')
    // },
    // onError: data => {
    //   toast.error(data?.response?.data?.message)
    // }
  })

  return mutation
}

export function useMarkNotificationAsSeen() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: notificationId => {
      return axiosClient.put(`/notifications/${notificationId}/seen`)
    },

    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })

      // toast.success(data?.data?.message)
    },
    onError: data => {
      // toast.error(data?.response?.data?.message)
    }
  })

  return mutation
}
