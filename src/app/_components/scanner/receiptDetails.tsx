import { useState, useCallback, Dispatch, SetStateAction, useEffect } from 'react';
import BottomButton from '@/app/(dashboard)/budget/[budgetId]/_components/bottomButton';
import { ScannedResult, ScannedItem } from '@/app/types/scan';
import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import Button from '../button';
import EditScannedExpenseDrawer from '../drawers/EditScannedExpense';
import { BudgetCategory } from '@/app/types/budget';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/app/utils/axiosInstance';
import { useAuthStore } from '@/app/store/useAuthStore';
import { ApiResponse } from '@/app/types/index';
import AmountItem from './_components/amountItem';
import LocationInfo from './_components/locationInfo';
import ItemList from './_components/itemList';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Props {
  scannedResults: ScannedResult | null;
  uploadedImageUrl: string;
  setScannedResults: Dispatch<SetStateAction<ScannedResult | null>>;
  budgetId: string;
}

export default function ReceiptDetails({
  scannedResults,
  uploadedImageUrl,
  setScannedResults,
  budgetId,
}: Props) {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [showEditScannedExpenseDrawer, setShowEditScannedExpenseDrawer] = useState(false);
  const { userData } = useAuthStore();
  const navigate = useRouter();

  const { data: budgetCategories, isLoading: isBudgetCategriesLoading } = useQuery<
    ApiResponse<BudgetCategory[]>
  >({
    queryKey: ['getAllBudgetCategories'],
    queryFn: async () =>
      (await api.get<ApiResponse<BudgetCategory[]>>('budgets/category')).data,
    enabled: !!userData?.token,
    refetchOnWindowFocus: true,
  });

  const approveCategorization = useMutation({
    mutationFn: async () => {
      if (!scannedResults?.items || scannedResults.items.length === 0) {
        throw new Error('No items to categorize');
      }

      // Format the data according to the required structure
      const payload = scannedResults.items.map((item: ScannedItem) => ({
        categoryId: item.categoryUid,
        expense: {
          amount: item.totalAmount,
          narration: item.name,
          date:
            scannedResults.locationInfo.date || new Date().toISOString().split('T')[0],
        },
      }));

      // Get the budget ID from the scanned results

      return api.post(`/budgets/${budgetId}/expense/bulk`, payload);
    },
    onSuccess: () => {
      toast.success('Expenses categorized successfully');
      navigate.push('/track');
      // You might want to redirect or clear the form here
    },
    onError: (error) => {
      console.error('Error categorizing expenses:', error);
      toast.error('Failed to categorize expenses');
    },
  });

  const handleCategoryClick = useCallback((index: number) => {
    setSelectedItemIndex(index);
    setShowEditScannedExpenseDrawer(true);
  }, []);

  const handleUpdateCategory = (category: BudgetCategory) => {
    console.log(category);

    const selectedCategory = budgetCategories?.data?.find(
      (cat: BudgetCategory) => cat.uid === category.uid,
    );
    if (selectedCategory) {
      setScannedResults((prev) => {
        if (!prev) return null;
        const updatedItems = prev.items.map((item: ScannedItem, index: number) => {
          if (index === selectedItemIndex) {
            return {
              ...item,
              categoryUid: selectedCategory.uid,
              categoryName: selectedCategory.name,
            };
          }
          return item;
        });
        return { ...prev, items: updatedItems };
      });
    }
  };

  if (!scannedResults) return null;

  return (
    <div className="bg-white px-6 space-y-[18px] min-h-screen w-full h-full max-w-[680px] z-[40] left-0 right-0 mx-auto top-0 fixed overflow-auto">
      <InnerPageHeader link="/track" title="Scanned Receipt" />

      <div className="border border-gray-200 rounded-3xl">
        <LocationInfo
          locationInfo={scannedResults.locationInfo}
          uploadedImageUrl={uploadedImageUrl}
        />

        <ItemList items={scannedResults.items} onCategoryClick={handleCategoryClick} />

        <TotalSection
          subTotal={scannedResults.subTotal}
          vat={scannedResults['vat(%)']}
          totalAmount={scannedResults.totalAmount}
        />
      </div>

      <BottomButton>
        <Button
          onClick={() => approveCategorization.mutate()}
          disabled={approveCategorization.isPending}
        >
          {approveCategorization.isPending ? 'Processing...' : 'Approve Categorization'}
        </Button>
      </BottomButton>

      {showEditScannedExpenseDrawer && selectedItemIndex != null && (
        <EditScannedExpenseDrawer
          show={showEditScannedExpenseDrawer}
          setShow={setShowEditScannedExpenseDrawer}
          budgetCategories={budgetCategories?.data ?? []}
          isBudgetCategriesLoading={isBudgetCategriesLoading}
          setScannedResults={setScannedResults}
          scannedItem={scannedResults?.items?.[selectedItemIndex]}
          handleUpdateCategory={handleUpdateCategory}
          index={selectedItemIndex}
        />
      )}
    </div>
  );
}

const TotalSection = ({
  subTotal,
  vat,
  totalAmount,
}: {
  subTotal: number;
  vat: number;
  totalAmount: number;
}) => (
  <div className="p-4 space-y-2">
    <AmountItem name="Sub-total" amount={subTotal} />
    <div className="w-full h-[1px] bg-gray-200" />
    <AmountItem name="VAT (7.5%)" amount={vat} />
    <div className="w-full h-[1px] bg-gray-200" />
    <AmountItem name="Total Amount" amount={totalAmount} type="total" />
  </div>
);

const updateScannedItemCategory = (
  scannedResults: ScannedResult,
  itemToUpdate: ScannedItem,
  newCategory: { uid: string; name: string },
): ScannedResult => {
  return {
    ...scannedResults,
    items: scannedResults.items.map((item) =>
      item === itemToUpdate
        ? {
            ...item,
            categoryId: newCategory.uid,
            categoryName: newCategory.name,
          }
        : item,
    ),
  };
};
