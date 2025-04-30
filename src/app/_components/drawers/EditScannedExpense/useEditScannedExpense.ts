import { ScannedItem, ScannedResult } from '@/app/types/scan';
import { Dispatch, SetStateAction } from 'react';
import { SubmitHandler } from 'react-hook-form';

export default function useEditScannedExpense({
  setShow,
  setScannedResults,
  scannedItem,
  index,
}: {
  setShow: (i: boolean) => void;
  setScannedResults: Dispatch<SetStateAction<ScannedResult | null>>;
  scannedItem: ScannedItem;
  index: number;
}) {
  const onSubmit: SubmitHandler<{
    name: string;
    quantity: string;
    total: string;
    price: string;
  }> = async (data) => {
    // console.log('log data', data);

    setScannedResults((prev) => {
      if (!prev) return null;
      const updatedItems = prev.items.map((item: ScannedItem, itemIndex: number) => {
        if (itemIndex === index) {
          return {
            ...item,
            name: data.name,
            quantity: parseFloat(data.quantity.replace(/[₦,]/g, '')),
            baseAmount: parseFloat(data.price.replace(/[₦,]/g, '')),
            totalAmount: parseFloat(data.total.replace(/[₦,]/g, '')),
            categoryUid: scannedItem.categoryUid,
            categoryName: scannedItem.categoryName,
          };
        }
        return item;
      });
      return {
        ...prev,
        items: updatedItems,
        // recalculate subtotals, totalAmount, and vat
        subTotal: updatedItems.reduce((acc, item) => acc + item.totalAmount, 0),
        totalAmount:
          updatedItems.reduce((acc, item) => acc + item.totalAmount, 0) + prev['vat(%)'],
      };
    });

    setShow(false);
  };
  return { onSubmit };
}
