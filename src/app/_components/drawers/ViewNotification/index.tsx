import React from 'react';
import BottomDrawer from '../BottomDrawer';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Notification } from '@/app/types/notifications';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  notification: Notification | null;
}

export default function ViewNotificationDrawer({ show, setShow, notification }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[680px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        label="Notification"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <div className="p-3 rounded-xl">
          <div className="space-y-1">
            <div className="font-medium flex justify-between">
              <p className="text-black-700 text-base">{notification?.title}</p>
              <div className="flex gap-1 items-center">
                <p className="text-gray-400 text-[12px] max-w-[85px]">
                  at {format(new Date(notification?.createdAt || ''), 'hh:mm a')}
                </p>
                {notification?.status === 'unread' && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </div>
            </div>
            <p className="text-gray-300 text-xs">{notification?.message}</p>
          </div>
        </div>
      </BottomDrawer>
    </motion.div>
  );
}
