import useTrackProgress from '@/app/_hooks/useTrackProgress';
import { CreateBudgetForm } from '@/app/types/budget';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

export default function useCreateBudget({
  setShow,
  type,
  budgetId,
  setTypeOfDrawer,
}: {
  setShow: (i: boolean) => void;
  type: 'create' | 'edit';
  budgetId?: string;
  setTypeOfDrawer?: Dispatch<SetStateAction<'create' | 'edit'>>;
}) {
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

  const editBudgetMutation = useMutation({
    mutationFn: (values: CreateBudgetForm) => api.patch(`/budgets/${budgetId}`, values),
    onSuccess: async (data) => {
      console.log(data.data);
      await queryClient.invalidateQueries({ queryKey: ['getAllBudgets'] });

      setShowLoadingModal(false);
      setShowSuccessModal(true);
      setShow(false);
      if (setTypeOfDrawer) {
        setTypeOfDrawer('create');
      }
    },
    onError: (error: unknown) => {
      console.error('Error editing budget:', error);
    },
  });

  const onSubmit: SubmitHandler<CreateBudgetForm> = async (data) => {
    // console.log('log data', data);
    setShowLoadingModal(true);
    if (type === 'edit') {
      await editBudgetMutation.mutateAsync(data);
    } else {
      await createBudgetMutation.mutateAsync(data);
    }
  };
  return {
    onSubmit,
    showLoadingModal,
    handleShowLoadingModal: () => setShowLoadingModal(false),
    showSuccessModal,
    handleShowSuccessModal: () => setShowSuccessModal(false),
  };
}
