import { createBudgetCategoryApi } from '@/app/services/BudgetService';
import { useAuthStore } from '@/app/store/useAuthStore';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function useEditCategory({ setShow }: { setShow: (i: boolean) => void }) {
  const { userData } = useAuthStore();
  const queryClient = useQueryClient();

  // create category mutation
  const editCategoryMutation = useMutation({
    mutationFn: (name: string) =>
      api.post<{ name: string }>('budgets/category', { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllBudgetCategories'] });
      toast.success('Category created successfully');
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
