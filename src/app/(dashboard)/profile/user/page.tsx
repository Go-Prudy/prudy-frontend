'use client';
import Header from '@/components/header';
import React, { ChangeEvent } from 'react';
import Image from 'next/image';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
import { useMutation } from '@tanstack/react-query';
import { updateProfilePhotoApi } from '@/app/services/SettingService';
import Input from '@/app/_components/input';
import { useAuthStore } from '@/app/store/useAuthStore';
import userAvatarIcon from '/public/images/icons/avatar.svg';
import LoadingModal from '@/app/_components/modals/LoadingModal';
import { Icons } from '@/app/icons';

const Page = () => {
  const { userData, updateUserProfile } = useAuthStore();

  const updateProfilePictureMutation = useMutation({
    mutationFn: (picture: File) => updateProfilePhotoApi(userData?.token ?? '', picture),
    onSuccess: (result) => {
      console.log('result successfully!', result);
      updateUserProfile({
        profilePhotoUrl: result.profilePhotoUrl,
      });
    },
    onError: (error) => console.error('Error updating profile picture:', error),
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateProfilePictureMutation.mutate(file);
    }
  };

  return (
    <div className="relative">
      <Header isHeaderDark link={`/profile`} title="Personal Information" />

      <div className="space-y-4 p-6">
        <div className="bg-gray-100 border border-gray-200 px-6 py-10 rounded-[20px] ">
          <div className="relative w-fit mx-auto">
            <Image
              src={userData?.profile?.profilePhotoUrl || userAvatarIcon}
              alt="profile"
              width={110}
              height={110}
              className="size-[110px] rounded-[28px] object-cover"
            />
            <label className="absolute -bottom-3 -right-3 bg-white h-8 w-8 rounded-full shadow-[0px_13px_37px_0px_#AAAAAA36] cursor-pointer flex items-center justify-center">
              <span className="h-fit w-fit text-gray-400">{Icons.camera}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <Input
          label="First name"
          inputName="firstName"
          type="text"
          value={userData?.profile.firstName}
        />
        <Input
          label="Last name"
          inputName="lastName"
          type="text"
          value={userData?.profile.lastName}
        />
        <Input
          label="Email address"
          inputName="emailAddress"
          type="email"
          value={userData?.profile.email}
        />
        <Input
          label="Phone number"
          inputName="phoneNumber"
          type="text"
          value={userData?.profile.phoneNumber}
        />
      </div>
      <LoadingModal
        isOpen={updateProfilePictureMutation.isPending}
        onClose={() => {}}
        text="Please wait..."
      />
    </div>
  );
};

export default Page;
