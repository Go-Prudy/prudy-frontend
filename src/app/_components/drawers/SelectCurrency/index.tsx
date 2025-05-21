import React, { Dispatch, SetStateAction } from 'react';
import BottomDrawer from '../BottomDrawer';
import { motion } from 'framer-motion';
import Loader from '../../loader';
import cn from 'classnames';
import useCurrency from './useCurrency';
import { Currency, SelectedCurrency } from '@/app/types/settings';
import Image from 'next/image';
import LoadingModal from '../../modals/LoadingModal';

type Props = {
  setShow: (i: boolean) => void;
  show: boolean;
  selectedCurrency: SelectedCurrency;
  setSelectedCurrency: Dispatch<SetStateAction<SelectedCurrency>>;
};
export default function SelectCurrencyDrawer({
  show,
  setShow,
  selectedCurrency,
  setSelectedCurrency,
}: Props) {
  const { allCurrencies, isFetchingCurrency, setCurrencyApiMutation } = useCurrency({
    setShow,
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[680px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        label="Select currency"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        {isFetchingCurrency ? (
          <Loader />
        ) : (
          <div className={cn('max-h-[360px] overflow-auto')}>
            {allCurrencies?.map((currency: Currency) => (
              <button
                key={currency.name}
                className={cn(
                  'flex gap-2 items-center py-2',
                  selectedCurrency?.currency === currency.abbreviation &&
                    'border-lemonGreen-600',
                )}
                onClick={async () => {
                  setSelectedCurrency({
                    currency: currency.abbreviation,
                    countryFlag: currency.flag,
                    currencySymbol: currency.symbol,
                  });
                  await setCurrencyApiMutation.mutateAsync({
                    countryCode: currency.countryCode,
                  });
                }}
              >
                <Image
                  src={currency?.flag}
                  alt={currency?.country}
                  width={24}
                  height={24}
                  className="rounded-full size-6 "
                />
                <p className="text-black-800 text-xs">{currency.name}</p>
              </button>
            ))}
          </div>
        )}
        <LoadingModal
          isOpen={setCurrencyApiMutation.isPending}
          onClose={() => {}}
          text="Please wait..."
        />
      </BottomDrawer>
    </motion.div>
  );
}
