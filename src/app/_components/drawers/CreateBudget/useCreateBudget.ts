import { SubmitHandler } from 'react-hook-form';

export default function useCreateBudget({ setShow }: { setShow: (i: boolean) => void }) {
  const onSubmit: SubmitHandler<{
    name: string;
  }> = async (data) => {
    console.log('log data', data);

    // == CREATE A BUDGET
    //  addBudget(budgetData as IBudget);
    //   navigate.push(`/budgets/new/income/${budgetData?.id}`);
    setShow(false);
  };
  return { onSubmit };
}
