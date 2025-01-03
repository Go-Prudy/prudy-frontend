import Image from 'next/image';
import React from 'react';
import warninglogo from '@/images/warn.gif'; // Update with the correct image path if needed

interface IDeleteConfirmationModalProps {
    showDeleteModal: boolean;
    setShowDeleteModal: (show: boolean) => void;
    handleDeleteCategoryById: (id: string) => void;
    categoryId: string; // Pass the specific category ID for deletion
}

const DeleteConfirmationModal: React.FC<IDeleteConfirmationModalProps> = ({
    showDeleteModal,
    setShowDeleteModal,
    handleDeleteCategoryById,
    categoryId,
}) => {
    if (!showDeleteModal) return null; // Don't render the modal if it's not supposed to be visible

    return (
        <div
            onClick={() => setShowDeleteModal(!showDeleteModal)}
            className="fixed bg-[#00000095] px-[24px] grid place-content-center h-[100vh] w-full z-[50] top-0"
        >
            <div className="bg-white flex flex-col rounded-[40px] items-center text-center w-full p-8">
                <Image src={warninglogo} alt="Warning" className="size-[90px]" width={1000} height={1000} />
                <h1 className="my-[8px] font-[500] text-[20px]">Delete category</h1>
                <p className="text-[#707170] leading-[24px]">
                    Are you sure you want to delete this category from your budget?
                </p>

                <div className="w-full flex gap-[16px] justify-between mt-[24px]">
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent modal from closing when clicking the button
                            handleDeleteCategoryById(categoryId);
                        }}
                        className="flex-1 bg-[#EFF0F6] text-[#514F6E] rounded-[32px] py-[14px] text-center"
                    >
                        Yes, delete
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent modal from closing when clicking the button
                            setShowDeleteModal(false);
                        }}
                        className="flex-1 bg-black text-white rounded-[32px] py-[14px] text-center"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
