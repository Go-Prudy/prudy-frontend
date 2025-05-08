'use client';
import Header from '@/components/header';
import { BsPlus } from 'react-icons/bs';
import LoadingModal from '@/app/_components/modals/LoadingModal';
import useBudgetCategories from './useBudgetCategories';
import Button from '@/app/_components/button';
import CreateCategoryDrawer from '@/app/_components/drawers/CreateCategory';
import EditCategoryDrawer from '@/app/_components/drawers/EditCategory';

const Page = () => {
  const {
    budgetCategories,
    isBudgetCategriesLoading,
    showCreateCategoryDrawer,
    setShowCreateCategoryDrawer,
    showEditCategoryDrawer,
    setShowEditCategoryDrawer,
    selectedCategory,
    setSelectedCategory,
  } = useBudgetCategories();

  return (
    <div className="relative">
      <Header isHeaderDark link={`/profile`} title="Budget Categories" />

      <div className="space-y-3 p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-gray-800">All Categories</p>
          <Button
            onClick={() => {
              setShowCreateCategoryDrawer(true);
            }}
            buttonIcon={<BsPlus size={16} />}
            buttonTitle="Add new category"
            buttonType="icon"
            className="!bg-lemonGreen-500"
          />
        </div>
        {budgetCategories.map((category) => (
          <p
            key={category.id}
            className="bg-gray-100 border border-gray-200 p-3 rounded-xl text-gray-700 text-sm cursor-pointer"
            onClick={() => {
              setSelectedCategory(category);
              setShowEditCategoryDrawer(true);
            }}
          >
            {category.name}
          </p>
        ))}
      </div>
      {showCreateCategoryDrawer && (
        <CreateCategoryDrawer
          show={showCreateCategoryDrawer}
          setShow={setShowCreateCategoryDrawer}
        />
      )}
      {showEditCategoryDrawer && (
        <EditCategoryDrawer
          show={showEditCategoryDrawer}
          setShow={setShowEditCategoryDrawer}
          selectedCategory={selectedCategory}
        />
      )}
      <LoadingModal
        isOpen={isBudgetCategriesLoading}
        onClose={() => {}}
        text="Fetching categories..."
      />
    </div>
  );
};

export default Page;
