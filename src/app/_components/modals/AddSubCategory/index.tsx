import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormModal from '../FormModal';
import Input from '../../input';
import { addSubcategorySchema } from '@/app/utils/validationSchema';
import { formatAmount } from '@/app/utils/functions';
import useAddSubCategory from './useAddSubCategory';

type Props = {
  setShow: (i: boolean) => void;
  show: boolean;
};

export default function AddSubCategoryDrawer({ show, setShow }: Props) {
  const { onSubmit } = useAddSubCategory({ setShow });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ name: string; amount: string }>({
    defaultValues: {
      name: '',
      amount: '',
    },
    resolver: yupResolver(addSubcategorySchema),
  });

  return (
    <FormModal
      title="Add Sub-Category"
      isOpen={show}
      onClose={() => setShow(false)}
      onClick={handleSubmit(onSubmit)}
    >
      <form className="space-y-6" id="create-budget-form">
        <Input
          label="Name of sub-category"
          inputName="name"
          type="text"
          placeholder="e.g Haircut"
          {...register('name')}
          error={errors?.name?.message}
        />
        <Input
          label="Amount"
          inputName="amount"
          type="text"
          placeholder="e.g ₦50,000"
          {...register('amount')}
          onChange={formatAmount}
          error={errors?.amount?.message}
        />
      </form>
    </FormModal>
  );
}
