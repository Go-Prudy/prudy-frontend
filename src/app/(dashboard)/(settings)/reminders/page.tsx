'use client';
import React, { useState } from 'react';
import { Switch } from '@nextui-org/react';
import { BsChevronRight } from 'react-icons/bs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import { useAuthStore } from '@/app/store/useAuthStore';
import SelectReminderTimeDrawer from '@/app/_components/drawers/SelectReminderTime';
import api from '@/app/utils/axiosInstance';
import LoadingModal from '@/app/_components/modals/LoadingModal';
import toast from 'react-hot-toast';

const Page: React.FC = () => {
  const { settings, updateSettings } = useAuthStore();

  const [showSelectReminderDrawer, setShowSelectReminderDrawer] =
    useState<boolean>(false);
  const [isReminderActive, setIsReminderActive] = useState<boolean>(
    settings?.isReminderActive || false,
  );

  const deactivateReminderMutation = useMutation({
    mutationFn: () => api.post('/settings/reminders/deactivate'),
    onSuccess: (data) => {
      updateSettings({
        ...data.data.data,
      });
      toast.success('Reminder deactivated successfully!');
      setIsReminderActive(false);
    },
    onError: () => {
      toast.error('Failed to deactivate reminder.');
    },
  });

  const toggleDailyReminder = async () => {
    if (!settings?.isReminderActive) {
      toast('Please select a time to activate the daily reminder.');
      return;
    } else {
      deactivateReminderMutation.mutate();
    }
  };

  return (
    <div>
      <InnerPageHeader link="/profile" title="Notifications & Reminders" />
      <div className="flex p-6">
        <div className="w-full rounded-3xl border border-gray-200 bg-gray-100 p-4 space-y-2">
          <h1 className="font-medium">Daily reminders</h1>
          <div className="bg-white rounded-xl text-sm text-gray-400 p-3 w-full flex justify-between items-center">
            <button className="" onClick={() => setShowSelectReminderDrawer(true)}>
              {settings?.isReminderActive ? (
                <p>
                  Remind me at: {settings.reminderTime} {settings.reminderTimeUnit}
                </p>
              ) : (
                <div className="flex gap-2 items-center">
                  Activate
                  <BsChevronRight size={16} />
                </div>
              )}
            </button>
            <Switch
              isSelected={isReminderActive}
              onChange={toggleDailyReminder}
              className="h-6"
              color="success"
            />
          </div>
        </div>
      </div>
      {showSelectReminderDrawer && (
        <SelectReminderTimeDrawer
          show={showSelectReminderDrawer}
          setShow={setShowSelectReminderDrawer}
          setIsReminderActive={setIsReminderActive}
        />
      )}
      <LoadingModal
        isOpen={deactivateReminderMutation.isPending}
        onClose={() => {}}
        text="Please wait..."
      />
    </div>
  );
};

export default Page;
