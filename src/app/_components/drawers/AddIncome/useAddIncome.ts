import { SubmitHandler } from 'react-hook-form';

export default function useAddIncome({
  setShow,
  budgetId,
}: {
  setShow: (i: boolean) => void;
  budgetId: string;
}) {
  const onSubmit: SubmitHandler<{
    name: string;
  }> = async (data) => {
    console.log('log data', data);

    setShow(false);
  };
  return { onSubmit };
}
