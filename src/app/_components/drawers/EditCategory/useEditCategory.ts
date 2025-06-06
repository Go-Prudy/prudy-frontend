import { createBudgetCategoryApi } from '@/app/services/BudgetService';
import { useAuthStore } from '@/app/store/useAuthStore';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function useEditCategory({
  setShow,
  id,
}: {
  setShow: (i: boolean) => void;
  id: string;
}) {
  const { userData } = useAuthStore();
  const queryClient = useQueryClient();

  // create category mutation
  const editCategoryMutation = useMutation({
    mutationFn: (name: string) =>
      api.patch<{ name: string }>(`settings/budget-categories/${id}`, { name }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getAllBudgetCategories'] });
      toast.success('Category edited successfully');
      setShow(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit: SubmitHandler<{
    name: string;
  }> = async (data) => {
    console.log('log data', data);
    await editCategoryMutation.mutateAsync(data.name);
  };
  return { onSubmit, editCategoryMutation };
}
