import { SubmitHandler } from 'react-hook-form';

export default function useAddManualExpense({ setShow }: { setShow: (i: boolean) => void }) {
  const onSubmit: SubmitHandler<{
    name: string;
    amount: string;
    date: string;
  }> = async (data) => {
    console.log('log data', data);

    setShow(false);
  };

  //   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedCategoryId: any = e.target.value; // Get the selected category ID
  //   const selectedCategory: any = categories.find(
  //     (category) => category.id === selectedCategoryId,
  //   ); // Find the category by ID

  //   if (selectedCategory) {
  //     setManualData((prevData) => ({
  //       ...prevData,
  //       category: selectedCategory.id, // Update the category in manualData with the selected category ID
  //     }));

  //     setSelectedCategory(selectedCategory.id);
  //     setSelectedCategoryId(categories[0].id);
  //   }
  // };

  //   const addManualMutation = useMutation({
  //   mutationFn: async (data) =>
  //     RecordExpenseApi(
  //       selectedBudget.uid,
  //       selectedCategoryId,
  //       data,
  //       authenticatedUser?.token ?? '',
  //     ),
  //   onSuccess: (data) => {
  //     setShowAddManualDrawer(false);
  //   },
  //   onError: (error) => {
  //     console.error('Error during logout:', error);
  //   },
  // });
  return { onSubmit };
}
