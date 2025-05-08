import { useAuthStore } from '@/app/store/useAuthStore';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

const reminderTimeRange = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? 'AM' : 'PM';
  return `${hour.toString().padStart(2, '0')}:00 ${period}`;
});

export default function useReminderTime({
  setShow,
  setIsReminderActive,
}: {
  setShow: (show: boolean) => void;
  setIsReminderActive: Dispatch<SetStateAction<boolean>>;
}) {
  const { updateSettings } = useAuthStore();
  const handleTimeSelect = async (time: string) => {
    console.log(time);

    const [hourString, period] = time.split(' ');
    const hour = parseInt(hourString.split(':')[0], 10);

    await activateReminderMutation.mutateAsync({
      reminderTime: hour,
      reminderTimeUnit: period,
    });
  };

  const activateReminderMutation = useMutation({
    mutationFn: (data: { reminderTime: number; reminderTimeUnit: string }) =>
      api.post('/settings/reminders/activate', data),
    onSuccess: (data) => {
      console.log(data.data.data);

      updateSettings({
        ...data.data.data,
      });
      toast.success('Reminder activated successfully!');
      setIsReminderActive(true);
      setShow(false);
    },
    onError: () => {
      toast.error('Failed to activate reminder.');
    },
  });

  return {
    reminderTimeRange,
    handleTimeSelect,
    activateReminderMutation,
  };
}
