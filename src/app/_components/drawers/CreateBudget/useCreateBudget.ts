import api from '@/app/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';
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
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useRouter();

  const createBudgetMutation = useMutation({
    mutationFn: (values: CreateBudgetForm) => api.post('/budgets', values),
    onSuccess: (data) => {
      console.log(data.data);
      setShowLoadingModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate.push(`/budget/${data.data.data.uid}`);
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
