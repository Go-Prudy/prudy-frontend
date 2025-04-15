import { SubAllocationForm } from '@/app/types/budget';
import { Dispatch, SetStateAction } from 'react';
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

type Props = {
  setShow: (i: boolean) => void;
  subAllocations: SubAllocationForm[];
  setSubAllocations: Dispatch<SetStateAction<SubAllocationForm[]>>;
  allocatedAmount: string;
};

export default function useAddSubCategory({
  setShow,
  subAllocations,
  setSubAllocations,
  allocatedAmount,
}: Props) {
  const onSubmit: SubmitHandler<{
    name: string;
    amount: string;
  }> = async (data) => {
    const parsedAllocated = Number(allocatedAmount.replace(/₦|,/g, '')) || 0;
    const parsedAmount = Number(data.amount.replace(/₦|,/g, '')) || 0;

    const currentTotal = subAllocations.reduce((sum, item) => {
      const cleanedAmount = Number(item.amount) || 0;
      return sum + cleanedAmount;
    }, 0);

    const amountLeft = parsedAllocated - currentTotal;

    if (parsedAmount > amountLeft) {
      toast.error(`You only have ${amountLeft} left to allocate.`);
      return;
    }
    setSubAllocations([...subAllocations, { ...data, amount: parsedAmount }]);

    console.log([...subAllocations, { ...data, amount: parsedAmount }]);

    setShow(false);
  };
  return { onSubmit };
}
