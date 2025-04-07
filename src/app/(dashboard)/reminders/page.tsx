'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CircularProgress, Switch } from '@nextui-org/react';
import { BsChevronRight } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useAuthentication } from '@/app/store/AuthStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ActivateReminderApi,
  DeactivateReminderApi,
  GetSettingsApi,
} from '@/app/services/SettingService';
import Header from '@/components/header';
import BottomDrawer from '@/app/_components/drawers/BottomDrawer';

const Page: React.FC = () => {
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { authenticatedUser } = useAuthentication();
  const [loading, setLoading] = useState(false);

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? 'AM' : 'PM';
    return `${hour.toString().padStart(2, '0')}:00 ${period}`;
  });

  const {
    data: getSettingsData = {},
    isPending: isSettingsLoading,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ['getSettings'],
    queryFn: () => GetSettingsApi(authenticatedUser?.token ?? ''),
    enabled: !!authenticatedUser?.token,
    staleTime: 5 * 60 * 1000,
  });

  const activateReminderMutation = useMutation({
    mutationFn: (data: { reminderTime: number; reminderTimeUnit: string }) =>
      ActivateReminderApi(authenticatedUser?.token ?? '', data),
    onSuccess: () => {
      toast.success('Reminder activated successfully!');
      refetchSettings();
    },
    onError: () => {
      toast.error('Failed to activate reminder.');
    },
  });

  const deactivateReminderMutation = useMutation({
    mutationFn: () => DeactivateReminderApi(authenticatedUser?.token ?? ''),
    onSuccess: () => {
      toast.success('Reminder deactivated successfully!');
      refetchSettings();
    },
    onError: () => {
      toast.error('Failed to deactivate reminder.');
    },
  });

  const toggleDailyReminder = async () => {
    const { reminderTime, reminderTimeUnit, isReminderActive } = getSettingsData;

    if (!reminderTime || !reminderTimeUnit) {
      alert('Please select a time to activate the daily reminder.');
      return;
    }

    setLoading(true);

    try {
      if (isReminderActive) {
        await deactivateReminderMutation.mutateAsync();
      } else {
        await activateReminderMutation.mutateAsync({
          reminderTime,
          reminderTimeUnit,
        });
      }
    } catch (error) {
      console.error('Error toggling daily reminder:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSelect = async (time: string) => {
    try {
      setSelectedTime(time);
      const [hourString, period] = time.split(' ');
      const hour = parseInt(hourString.split(':')[0], 10);

      await activateReminderMutation.mutateAsync({
        reminderTime: hour,
        reminderTimeUnit: period,
      });

      setShowTimeModal(false);
    } catch (error) {
      console.error('Error selecting time:', error);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 90 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className=" w-[100vw] min-h-[100vh] max-w-[500px]"
      >
        <Header link="/profile" title="Notifications & Reminders" />
        <div className="flex   w-[100vw] max-w-[500px] flex-col gap-[16px] p-[24px]">
          <div className="border rounded-[12px] border-[#EFEFF0] bg-[#F7F7F9] p-[16px]">
            <h1 className="leading-[28px] font-[500]">Daily reminders</h1>
            {isSettingsLoading ? (
              <div className="mt-[8px] p-[12px] text-center">Loading...</div>
            ) : (
              <div
                className="mt-[8px] bg-[#FFFFFF] rounded-[12px] font-[400] text-[14px] text-[#828282] p-[12px] w-full flex justify-between items-center"
                onClick={() => setShowTimeModal(true)}
              >
                <div className="flex gap-[8px] items-center">
                  {getSettingsData?.reminderTime ? (
                    <>
                      Remind me at: {getSettingsData.reminderTime}{' '}
                      {getSettingsData.reminderTimeUnit}
                    </>
                  ) : (
                    <>Activate</>
                  )}
                  <span>
                    <BsChevronRight size={20} />
                  </span>
                </div>
                <div className="h-[24px] flex items-center">
                  {loading ? (
                    <CircularProgress size="sm" color="default" />
                  ) : (
                    <Switch
                      isSelected={getSettingsData.isReminderActive}
                      onChange={toggleDailyReminder}
                      className="h-[24px]"
                      color="success"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      {showTimeModal && (
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 w-full h-[120vh] z-[40] bg-[#1c1c1c73]"
        >
          <BottomDrawer
            label="Select time"
            back={false}
            show={showTimeModal}
            close={true}
            onClose={() => setShowTimeModal(false)}
          >
            <div className="flex h-[40vh] overflow-y-scroll w-full flex-wrap">
              <ul className="w-full text-center">
                {times.map((time) => (
                  <li
                    key={time}
                    className="py-[12px] text-center border-b border-[#EFEFF0]"
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </li>
                ))}
              </ul>
            </div>
          </BottomDrawer>
        </motion.div>
      )}
    </div>
  );
};

export default Page;
