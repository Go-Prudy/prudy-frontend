import { useAuthStore } from '@/app/store/useAuthStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/app/types/index';
import api from '@/app/utils/axiosInstance';
import { Currency } from '@/app/types/settings';

export default function useCurrency({ setShow }: { setShow: (show: boolean) => void }) {
  const { userData } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['getAllCurrencies'],
    queryFn: async () => (await api.get<ApiResponse<Currency[]>>('misc/currencies')).data,
    enabled: !!userData?.token,
  });

  const setCurrencyApiMutation = useMutation({
    mutationFn: (data: any) => api.post('settings/currency', data),
    onSuccess: (data) => {
      console.log(data);
      setShow(false);
    },
    onError: (error: unknown) => {
      console.error('Error inviting collaborator:', error);
    },
  });

  return {
    allCurrencies: data?.data,
    isFetchingCurrency: isLoading,
    setCurrencyApiMutation,
  };
}
