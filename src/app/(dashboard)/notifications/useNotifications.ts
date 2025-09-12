import { useAuthStore } from '@/app/store/useAuthStore';
import { Notification } from '@/app/types/notifications';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function useNotifications() {
  const queryClient = useQueryClient();
  const { userData } = useAuthStore();

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(
    null,
  );

  const { data: notificationsData, isLoading: isGetNotificationsLoading } = useQuery({
    queryKey: ['getNotications'],
    queryFn: async () =>
      (await api.get<AxiosResponse<Notification[]>>('/notifications')).data,
    enabled: !!userData?.token,
    refetchOnWindowFocus: false,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      api.patch(`/notifications/${notificationId}/read`),
    onSuccess: async (data) => {
      console.log(data);

      await queryClient.invalidateQueries({ queryKey: ['getNotications'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {},
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => api.patch(`/notifications/read-all`),
    onSuccess: async (data) => {
      console.log(data);

      await queryClient.invalidateQueries({ queryKey: ['getNotications'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || 'Failed to mark all as read');
    },
  });

  return {
    notifications: notificationsData?.data,
    isGetNotificationsLoading,
    markAsReadMutation,
    markAllAsReadMutation,
    showNotification,
    setShowNotification,
    selectedNotification,
    setSelectedNotification,
  };
}
