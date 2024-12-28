'use client'
import React from 'react'
import { motion } from 'framer-motion';
import shake from '@/images/shake.gif'
import Image from 'next/image';
import { BsX } from 'react-icons/bs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { acceptBudgetInviteApi, getPendingInvitesApi, rejectBudgetInviteApi } from '@/app/services/InviteService';
import { useAuthentication } from '@/app/store/AuthStore';

interface Budget {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    id: number;
    uid: string;
    name: string;
    purpose: string;
    startDate: string;
    endDate: string;
}

interface IOwner {
    email: string;
    firstName: string;
    lastName: string;
}
interface Invite {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    id: number;
    owner: IOwner
    uid: string;
    email: string;
    status: string;
    budget: Budget;
}

interface IProps {
    refetchAllBudgets: () => void;
    setShow: (i: boolean) => void;
    show: boolean,
    getPendingInvitesApiData: Invite[]
}

const InviteModal = ({ refetchAllBudgets, show, setShow, getPendingInvitesApiData }: IProps) => {
    const { authenticatedUser } = useAuthentication();



    // Assuming data structure matches the provided example, select the first invite for simplicity
    const inviteData = getPendingInvitesApiData?.[0];
    const inviterName = inviteData?.owner?.firstName + ' ' +
        inviteData?.owner?.lastName
        || 'Unknown User';
    const budgetName = inviteData?.budget?.name || 'Unnamed Budget';






    const acceptInviteMutation = useMutation({
        mutationFn: () =>
            acceptBudgetInviteApi(getPendingInvitesApiData[0]?.uid, getPendingInvitesApiData[0]?.budget?.uid, authenticatedUser?.token ?? ''),

        onSuccess: () => {
            console.log('Invite accepted successfully!');
            setShow(!show)
            refetchAllBudgets()
            // You can add any other success handling logic here, such as updating the UI
        },
        onError: (error: unknown) => {
            console.error('Error accepting invite:', error);
        },
    });
    const handleAcceptInvite = async () => {
        try {
            await acceptInviteMutation.mutateAsync();
        } catch (error) {
            console.error('Error in handleAcceptInvite:', error);
        }
    };


    // React Query mutation to reject a budget invite
    const rejectInviteMutation = useMutation({
        mutationFn: () =>
            rejectBudgetInviteApi(getPendingInvitesApiData[0]?.uid, getPendingInvitesApiData[0]?.budget?.uid, authenticatedUser?.token ?? ''),
        onSuccess: () => {
            console.log('Invite rejected successfully!');
            setShow(!show)
            // Add any additional success handling logic here, such as updating the UI
        },
        onError: (error: unknown) => {
            console.error('Error rejecting invite:', error);
        },
    });

    // Handler to call the reject mutation
    const handleRejectInvite = async () => {
        try {
            await rejectInviteMutation.mutateAsync();
        } catch (error) {
            console.error('Error in handleRejectInvite:', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-[100vh] max-w-[500px] flex items-center justify-center w-full z-[40] bottom-0 fixed p-[24px] bg-[#1c1c1c73]"
        >
            <div className='relative text-center flex rounded-[40px] p-[24px] justify-center items-center flex-col bg-white'>
                <div onClick={() => setShow(!show)} className='absolute top-[19px] right-[19px] size-[28px] bg-[#EFF0F6] rounded-[8px] grid place-content-center'>
                    <BsX size={20} className='text-black' />
                </div>
                <Image src={shake} className='size-[80px]' height={1000} width={1000} alt='shake' />
                <h1 className='mt-[24px] text-[20px] font-[500] leading-[28px]'>Collaboration Invite</h1>
                <p className='mt-[8px]'>You have been invited by
                    <span className='font-[500]'> {inviterName}  </span>to collaborate on
                    <span className='font-[500]'> {budgetName} </span>
                </p>

                <div className='mt-[24px] flex items-center gap-[16px]'>
                    <button onClick={() => handleRejectInvite()} className='font-[500] shadow-md bg-[#F7F7F9] rounded-[32px] w-[139px] h-[48px]'>
                        {rejectInviteMutation.isPending ? 'Declining...' : 'Decline'}
                    </button>
                    <button onClick={() => handleAcceptInvite()} className='text-white shadow-md font-[500] bg-[#040404] rounded-[32px] w-[139px] h-[48px]'>
                        {acceptInviteMutation.isPending ?
                            'Accepting....' : '  Accept invite'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default InviteModal;
