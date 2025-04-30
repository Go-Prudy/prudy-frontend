import { ApiResponse } from '@/app/types/index';
import api from '@/app/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface LinkAccountResponse {
  url: string;
}

export default function useGetStarted() {
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [showCreateBudgetModal, setShowCreateBudgetModal] = useState<boolean>(false);

  const linkAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post<ApiResponse<LinkAccountResponse>>('accounts/link');
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      console.log(data);

      if (data.data.url) {
        window.location.href = data.data.url;
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || 'An error occurred');
    },
  });
  return {
    linkAccountMutation,
    showScanner,
    setShowScanner,
    showCreateBudgetModal,
    setShowCreateBudgetModal,
  };
}
