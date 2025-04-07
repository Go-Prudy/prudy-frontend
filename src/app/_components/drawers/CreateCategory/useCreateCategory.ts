import { createBudgetCategoryApi } from '@/app/services/BudgetService';
import { useAuthentication } from '@/app/store/AuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function useCreateCategory({
  setShow,
}: {
  setShow: (i: boolean) => void;
}) {
  const { authenticatedUser } = useAuthentication();
  const queryClient = useQueryClient();

  // create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) =>
      createBudgetCategoryApi(
        { name, subCategories: [] },
        authenticatedUser?.token || '',
      ),
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
    await createCategoryMutation.mutateAsync(data.name);
  };
  return { onSubmit, createCategoryMutation };
}
