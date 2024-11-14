"use client";
import Header from '@/components/header';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { BsCamera, BsPerson } from 'react-icons/bs';
import Image from 'next/image';
import cameraIcon from '@/images/camera.png';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchUserProfileApi, updateProfilePhotoApi } from '@/app/services/SettingService';
import { useAuthentication } from '@/app/store/AuthStore';

const Page = () => {
    const { authenticatedUser, login } = useAuthentication();
    console.log(authenticatedUser?.profile);

    const { data: userProfile = {} } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => fetchUserProfileApi(authenticatedUser?.token ?? ''),
        enabled: !!authenticatedUser?.token,
        staleTime: 5 * 60 * 1000,
    });

    const [value, setValue] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (authenticatedUser?.profile) {
            setEmail(authenticatedUser?.profile.email || '');
            setFirstName(authenticatedUser?.profile.firstName || '');
            setLastName(authenticatedUser?.profile.lastName || '');
            setValue(authenticatedUser?.profile.phoneNumber || '');
        }
    }, [authenticatedUser?.profile]);

    const updateProfilePictureMutation = useMutation({
        mutationFn: (picture: File) =>
            updateProfilePhotoApi(authenticatedUser?.token ?? '', picture),
        onSuccess: (result) => {
            console.log("result successfully!", result)
            const data: any = authenticatedUser
            const newData = {
                ...data,
                profile: {
                    ...data.profile,
                    profilePhotoUrl: result.profilePhotoUrl
                }
            }

            login(newData);
        },
        onError: (error) => console.error("Error updating profile picture:", error),
    });

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file)); // Generate and set the preview URL
        }
    };

    useEffect(() => {
        // Cleanup the object URL to avoid memory leaks when component unmounts
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    useEffect(() => {
        if (profileImage) updateProfilePictureMutation.mutate(profileImage);
    }, [profileImage]);

    return (
        <div className="relative h-screen">
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', stiffness: 600 }}
            >
                <div className="relative">
                    <Header link={`/profile`} title="Profile" />
                    <div className="flex w-full justify-center">
                        <div className={`bg-white border mt-[30px] ${!authenticatedUser?.profile?.profilePhotoUrl ? 'p-2' : 'p-0'} rounded-full relative w-[100px] h-[100px] flex items-center justify-center`}>
                            {updateProfilePictureMutation.isPending ? (
                                <div className="loader w-[50px] h-[50px] border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

                            ) : previewImage ? (
                                <Image
                                    src={previewImage}
                                    alt="profile"
                                    width={1000}
                                    height={1000}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : userProfile.profilePhotoUrl ? (
                                <Image
                                    src={userProfile.profilePhotoUrl}
                                    alt="profile"
                                    width={1000}
                                    height={1000}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <BsPerson className="text-[#040404] w-[100px] h-[100px]" />
                            )}
                            <label className="absolute top-[73%] right-0 h-[32px] w-[32px] rounded-full shadow-md cursor-pointer">
                                <Image
                                    alt="Upload Image"
                                    src={cameraIcon}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[16px] p-[24px]">
                        <label className="flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]" htmlFor="firstName">
                            <h1 className="text-[12px] text-[#575757] leading-[16px]">First name</h1>
                            <input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter First Name"
                                className="bg-transparent outline-none font-[500] leading-[24px]"
                                type="text"
                            />
                        </label>
                        <label className="flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]" htmlFor="lastName">
                            <h1 className="text-[12px] text-[#575757] leading-[16px]">Last name</h1>
                            <input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter Last Name"
                                className="bg-transparent outline-none font-[500] leading-[24px]"
                                type="text"
                            />
                        </label>
                        <label className="flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]" htmlFor="email">
                            <h1 className="text-[12px] text-[#575757] leading-[16px]">Email address</h1>
                            <input
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                className="bg-transparent outline-none font-[500] leading-[24px]"
                                type="email"
                            />
                        </label>
                        <label className="flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]" htmlFor="phone">
                            <h1 className="text-[12px] text-[#575757] leading-[16px]">Phone number</h1>
                            <PhoneInput
                                country={'ng'}
                                value={value}
                                onChange={setValue}
                                inputProps={{
                                    name: 'phone',
                                    required: true,
                                    autoFocus: true,
                                    placeholder: 'Enter phone number',
                                }}
                            />
                        </label>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Page;
