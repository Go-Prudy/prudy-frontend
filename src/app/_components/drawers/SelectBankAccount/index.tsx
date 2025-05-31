'use client';

import { motion } from 'framer-motion';
import BottomDrawer from '../BottomDrawer';
import Button from '../../button';
import { RadioGroup } from '@nextui-org/react';
import CustomRadio from '../../radio';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  linkedAccounts: {
    institutionName: string;
    accountName: string;
    accountNumber: string;
  }[];
  isLoading: boolean;
  setShowSyncPeriodDrawer: Dispatch<SetStateAction<boolean>>;
  selectedAccountId: string;
  setSelectedAccountId: Dispatch<SetStateAction<string | undefined>>;
}

const SelectBankAccountDrawer = ({
  setShow,
  show,
  linkedAccounts,
  isLoading,
  setShowSyncPeriodDrawer,
  selectedAccountId,
  setSelectedAccountId,
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[680px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        footer={
          <Button
            disabled={!selectedAccountId}
            onClick={() => setShowSyncPeriodDrawer(true)}
            type="submit"
          >
            Proceed
          </Button>
        }
        label="Select Bank Account"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Kindly select the bank account you would like to sync with
          </p>
          <RadioGroup
            orientation="vertical"
            className="w-full"
            color="success"
            onValueChange={(value) => setSelectedAccountId(value)}
          >
            {isLoading ? (
              <div className="mx-auto w-full my-[3rem]">Loading accounts...</div>
            ) : linkedAccounts.length > 0 ? (
              linkedAccounts.map((account: any, index: any) => (
                <CustomRadio
                  key={index}
                  isSelected={selectedAccountId === account.uid}
                  // this is not selecting account
                  onChange={() => setSelectedAccountId(account.uid)}
                  value={index}
                >
                  <p className="">{account.institutionName}</p>

                  <div className="w-full flex gap-2 justify-between">
                    <p> {account.accountName} </p>
                    <p> {account.accountNumber}</p>
                  </div>
                </CustomRadio>
              ))
            ) : (
              <p className="text-sm text-gray-600">
                You have not linked your bank account yet. Kindly add your account to
                track your expenses to track your expenses easily.
                {/*  */}
              </p>
            )}
          </RadioGroup>
        </div>
      </BottomDrawer>
    </motion.div>
  );
};

export default SelectBankAccountDrawer;
