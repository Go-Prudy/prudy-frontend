'use client';

import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import Button from '@/app/_components/button';
import succesGif from '/public/images/success.gif';
import SuccessfulModal from '@/app/_components/modals/SuccessfulModal';
import Input from '@/app/_components/input';
import { useForm } from 'react-hook-form';
import usePasscode from './usePasscode';
import { yupResolver } from '@hookform/resolvers/yup';
import { changePasscodeSchema } from '@/app/utils/validationSchema';

const Page = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPasscode: '',
      newPasscode: '',
      confirmPasscode: '',
    },
    resolver: yupResolver(changePasscodeSchema),
  });
  const {
    onSubmit,
    changePasswordMutation,
    showSuccessfulModal,
    setShowSuccessfulModal,
  } = usePasscode();

  return (
    <div className="">
      <InnerPageHeader isHeaderDark link={`/profile`} title="Passcode Settings" />

      <div className="p-6 space-y-6">
        <p className="font-medium text-black-800">Change your passcode</p>

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Old passcode"
              inputName="oldPasscode"
              type="password"
              placeholder="Enter current passcode"
              {...register('oldPasscode')}
              error={errors.oldPasscode?.message}
              inputMode="numeric"
              pattern="\d*"
            />
            <p className="text-sm text-gray-600 font-medium">New passcode</p>
            <Input
              label="New passcode"
              inputName="newPasscode"
              type="password"
              placeholder="Set new passcode"
              {...register('newPasscode')}
              error={errors.newPasscode?.message}
              inputMode="numeric"
              pattern="\d*"
            />
            <Input
              label="Confirm new passcode"
              inputName="confirmPasscode"
              type="password"
              placeholder="Enter new passcode"
              {...register('confirmPasscode')}
              error={errors.confirmPasscode?.message}
              inputMode="numeric"
              pattern="\d*"
            />
            <Button type="submit" loading={changePasswordMutation.isPending}>
              Change passcode
            </Button>
          </form>
        </div>
      </div>

      <SuccessfulModal
        title="New passcode set successfully"
        isOpen={showSuccessfulModal}
        onClose={() => setShowSuccessfulModal(false)}
        image={succesGif}
      />
    </div>
  );
};

export default Page;
