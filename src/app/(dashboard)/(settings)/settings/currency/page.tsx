'use client';
import React, { useState } from 'react';
import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import Flag from 'react-world-flags'; // import flag component
import Image from 'next/image';
import SelectCurrencyDrawer from '@/app/_components/drawers/SelectCurrency';
import { SelectedCurrency } from '@/app/types/settings';
import { useAuthStore } from '@/app/store/useAuthStore';

const Page = () => {
  const [showAllCurrencyDrawer, setShowAllCurrencyDrawer] = useState(false);
  const { settings } = useAuthStore();
  const [selectedCurrecy, setSelectedCurrency] = useState<SelectedCurrency>({
    countryFlag: settings?.countryFlag || '',
    currency: settings?.currency || '',
    currencySymbol: settings?.currencySymbol || '',
  });

  return (
    <div>
      <InnerPageHeader isHeaderDark link={`/profile`} title="Currency Settings" />
      <div className="p-6 space-y-6">
        <h1 className="text-xl font-medium text-black-800">
          Set your preferred currency
        </h1>

        <div className="bg-gray-100 p-4 rounded-3xl border-gray-200 border">
          <div className="text-gray-400 text-xs w-full flex items-center justify-between">
            <p className="">Default currency</p>
            <button
              onClick={() => setShowAllCurrencyDrawer(true)}
              className=" bg-white rounded-[10px] py-1 px-2"
            >
              change
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={selectedCurrecy?.countryFlag || ''}
              width={24}
              height={24}
              className="size-6 rounded-full"
              alt=""
            />
            <p className="text-sm font-medium">{selectedCurrecy?.currency || 'NGN'}</p>
          </div>
        </div>
      </div>

      {showAllCurrencyDrawer && (
        <SelectCurrencyDrawer
          show={showAllCurrencyDrawer}
          setShow={setShowAllCurrencyDrawer}
          selectedCurrency={selectedCurrecy}
          setSelectedCurrency={setSelectedCurrency}
        />
      )}
    </div>
  );
};

export default Page;
