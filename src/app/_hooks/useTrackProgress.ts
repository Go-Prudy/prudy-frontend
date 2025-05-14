import api from '@/app/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function useTrackProgress() {
  const trackProgressMutation = useMutation({
    mutationFn: async (key: string) => {
      const response = await api.post('/onboarding/progress', { stepKey: key });
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
    },
  });
  return { trackProgressMutation };
}
