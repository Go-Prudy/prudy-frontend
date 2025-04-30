import { motion } from 'framer-motion';
import BottomDrawer from '../BottomDrawer';
import { useForm } from 'react-hook-form';
import Button from '../../button';
import Input from '../../input';
import { formatAmount } from '@/app/utils/functions';
import SelectCategoryDrawer from '../SelectCategory';
import { BudgetCategory } from '@/app/types/budget';
import CategorySelectInput from '../../categorySelectInput';
import useAddManualExpense from './useAddManualExpense';
import { addManualExpenseSchema } from '@/app/utils/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import SuccessfulModal from '../../modals/SuccessfulModal';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  budgetId: string;
  categories: BudgetCategory[];
  isLoadingCategories: boolean;
}

const AddManualExpenseDrawer = ({
  setShow,
  show,
  budgetId,
  categories,
  isLoadingCategories,
}: Props) => {
  const {
    onSubmit,
    showCategoriesDrawer,
    setShowCategoriesDrawer,
    selectedCategory,
    setSelectedCategory,
    showSuccessModal,
    handleCloseSuccessModal,
    addManualExpenseMutation,
  } = useAddManualExpense({ setShow, budgetId, categories });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ narration: string; amount: string; date: string }>({
    defaultValues: {
      narration: '',
      amount: '',
      date: '',
    },
    resolver: yupResolver(addManualExpenseSchema),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[500px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        footer={
          <Button
            disabled={!selectedCategory}
            onClick={handleSubmit(onSubmit)}
            loading={addManualExpenseMutation.isPending}
            type="submit"
          >
            Save
          </Button>
        }
        label="Add Expense Manually"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <form className="space-y-6" id="create-budget-form">
          <Input
            label="Name of Item"
            inputName="narration"
            type="text"
            placeholder="January..."
            {...register('narration')}
            error={errors?.narration?.message}
          />
          <Input
            label="Total Amount"
            inputName="purpose"
            type="text"
            placeholder="e.g ₦50,000"
            {...register('amount')}
            onChange={formatAmount}
            error={errors?.amount?.message}
          />
          <div className="flex items-center gap-4">
            <Input
              label="Date"
              inputName="date"
              type="date"
              placeholder="Select date..."
              {...register('date')}
              error={errors?.date?.message}
            />
            <CategorySelectInput
              setShowCategoriesDrawer={setShowCategoriesDrawer}
              category={selectedCategory}
            />
          </div>

          {showCategoriesDrawer && (
            <SelectCategoryDrawer
              show={showCategoriesDrawer}
              setShow={setShowCategoriesDrawer}
              categories={categories}
              isLoading={isLoadingCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          )}

          <SuccessfulModal
            isOpen={showSuccessModal}
            onClose={handleCloseSuccessModal}
            title="Added Successfully"
          />
        </form>
      </BottomDrawer>
    </motion.div>
  );
};

export default AddManualExpenseDrawer;
