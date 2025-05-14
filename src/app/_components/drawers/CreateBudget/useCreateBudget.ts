import useTrackProgress from '@/app/_hooks/useTrackProgress';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

interface CreateBudgetForm {
  name: string;
  purpose: string;
  startDate: string;
  endDate: string;
}

export default function useCreateBudget({ setShow }: { setShow: (i: boolean) => void }) {
  const queryClient = useQueryClient();
  const navigate = useRouter();
  const { trackProgressMutation } = useTrackProgress();

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const createBudgetMutation = useMutation({
    mutationFn: (values: CreateBudgetForm) => api.post('/budgets', values),
    onSuccess: async (data) => {
      console.log(data.data);
      trackProgressMutation.mutate('budget_creation');
      await queryClient.invalidateQueries({ queryKey: ['getAllBudgets'] });

      setShowLoadingModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate.push(`/budget/${data.data.data.uid}`);
        setShowSuccessModal(false);
        setShow(false);
      }, 2000);
    },
    onError: (error: unknown) => {
      console.error('Error creating budget:', error);
    },
  });

  const onSubmit: SubmitHandler<CreateBudgetForm> = async (data) => {
    console.log('log data', data);
    setShowLoadingModal(true);
    await createBudgetMutation.mutateAsync(data);
  };
  return {
    onSubmit,
    showLoadingModal,
    handleShowLoadingModal: () => setShowLoadingModal(false),
    showSuccessModal,
    handleShowSuccessModal: () => setShowSuccessModal(false),
  };
}
