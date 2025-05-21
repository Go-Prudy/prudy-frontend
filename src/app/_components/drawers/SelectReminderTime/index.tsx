import BottomDrawer from '../BottomDrawer';
import { motion } from 'framer-motion';
import LoadingModal from '../../modals/LoadingModal';
import useReminderTime from './useReminderTime';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  setShow: (i: boolean) => void;
  show: boolean;
  setIsReminderActive: Dispatch<SetStateAction<boolean>>;
};
export default function SelectReminderTimeDrawer({
  show,
  setShow,
  setIsReminderActive,
}: Props) {
  const { reminderTimeRange, handleTimeSelect, activateReminderMutation } =
    useReminderTime({
      setShow,
      setIsReminderActive,
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
        label="Select time"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <ul className="w-full text-center">
          {reminderTimeRange.map((time) => (
            <li
              key={time}
              className="py-[12px] text-center border-b border-gray-200"
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </li>
          ))}
        </ul>
        <LoadingModal
          isOpen={activateReminderMutation.isPending}
          onClose={() => {}}
          text="Please wait..."
        />
      </BottomDrawer>
    </motion.div>
  );
}
