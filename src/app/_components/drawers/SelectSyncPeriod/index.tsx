import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import BottomDrawer from '../BottomDrawer';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Button from '../../button';
import useSelectSyncPeriod from './useSelectSyncPeriod';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type Props = {
  setShow: (i: boolean) => void;
  show: boolean;
  value: Value;
  onChange: Dispatch<SetStateAction<Value>>;
  accountId: string;
  selectedBudgetId: string;
};

export default function SelectSyncPeriodDrawer({
  show,
  setShow,
  value,
  onChange,
  accountId,
  selectedBudgetId,
}: Props) {
  const { setEnableSync, isSyncing } = useSelectSyncPeriod({
    accountId,
    selectedBudgetId,
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
        footer={
          <Button
            loading={isSyncing}
            onClick={() => {
              console.log(value, accountId);
              setEnableSync(true);
            }}
          >
            Proceed
          </Button>
        }
        label="Select Sync Period"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Kindly select the period where you would like your transactions to sync
            through
          </p>
          <Calendar
            onChange={onChange}
            value={value}
            selectRange
            prev2Label={null}
            next2Label={null}
            maxDate={new Date()}
            nextLabel={<BsChevronRight />}
            prevLabel={<BsChevronLeft />}
            className="!w-full !bg-white !border !border-gray-200 !rounded-2xl !p-2"
          />
        </div>
      </BottomDrawer>
    </motion.div>
  );
}
