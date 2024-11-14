'use client'
import Header from '@/components/header'
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import { BsPerson, BsThreeDotsVertical, BsX } from 'react-icons/bs';

const Page = () => {
    const [showRemove, setShowRemove] = useState<number | null>(null); // Track the index of the clicked user
    const [removeGuestModal, setRemoveGuestModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>({})
    const users = [
        {
            name: "James Johnson",
            email: "jamesjohn@gmail.com",
            role: "HOST",
            imageUrl: "" // Replace with actual image URL  
        },
        {
            name: "Sandra Johnson",
            email: "sandrasssssssjohn@gmail.com",
            role: "GUEST",
            imageUrl: "" // Replace with actual image URL  
        }
    ];

    const truncateEmail = (email: string) => {
        const [localPart, domain] = email.split('@');
        if (localPart.length > 10) { // Adjust as necessary
            const start = localPart.slice(0, 5); // First 5 characters
            const end = localPart.slice(-3); // Last 3 characters
            return `${start}....${end}@${domain}`; // Format as required
        }
        return email; // Return the full email if it's short enough
    };

    const handleRemoveUser = (index: number) => {
        console.log(`Remove user at index: ${index}`);
        setRemoveGuestModal(!removeGuestModal)
        setSelectedUser(null)
        setShowRemove(null)
    }



    return (
        <div className='relative w-full h-screen'>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', stiffness: 600 }}
            >
                <motion.div className='w-full relative'>
                    <Header link={`/profile`} title="Collaborators" />
                    <div className='flex flex-col gap-[24px] p-[24px] justify-center'>
                        <div className='flex justify-center gap-[16px]'>
                            {users.map((user, index) => (
                                <div
                                    key={index}
                                    className='bg-[#F7F7F9] text-center items-center p-[15.2px] border-[#EFEFF0] border rounded-[16px] w-[162.5px] flex flex-col gap-[12px] justify-center relative'
                                >
                                    <div className='rounded-[12px] border p-2 bg-white'>
                                        <BsPerson className='size-[24px]' />
                                    </div>

                                    <h2 className='leading-[16px] text-[#2D2D2D] font-[500] truncate'>
                                        {user.name}
                                    </h2>
                                    <p className='text-wrap leading-[16px] mt-[12px] text-[13px] text-[#828282] overflow-hidden break-words'>
                                        {truncateEmail(user.email)}
                                    </p>
                                    <button className='text-[#828282] text-[10px] px-[8px] py-[2px] leading-[16px] bg-white rounded-[10px]'>
                                        {user.role}
                                    </button>

                                    <BsThreeDotsVertical
                                        onClick={() => setShowRemove(showRemove === index ? null : index)} // Toggle remove for the specific user
                                        size={30}
                                        className='rounded-[4px] absolute top-[12px] right-[12px] bg-white px-[8.8px] py-[4.4px]'
                                    />

                                    {showRemove === index && (
                                        <div className="absolute top-[40px] right-[12px] bg-white p-[8px] rounded-[8px] shadow-lg">
                                            <button className='flex gap-[8px] px-[12px] py-[8px] items-center justify-center text-[12px] text-[#575757]' onClick={() => {
                                                handleRemoveUser(index)

                                                setSelectedUser(user)
                                            }}>
                                                <div className='bg-[#F5365C] rounded-[4px] text-white flex justify-center items-center gap-[4px] size-[16px]'>-</div>
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {removeGuestModal &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[100vh] w-full z-[40] top-0 flex justify-center items-center px-[24px]    fixed bg-[#1c1c1c73]"
                >
                    <div className=" text-[#707170] rounded-[40px] w-full p-[24px] bg-white">
                        <div className=' flex mb-[8px] justify-between  w-full'>

                            <div></div>
                            <h1 className=' text-[#292B31] text-center font-[500] text-[20px] '>Remove guest</h1>
                            <div> <button onClick={() => setRemoveGuestModal(!removeGuestModal)} className=' text-[#292A29] rounded-[8px] bg-[#EFF0F6] p-[9px] '>
                                <BsX size={20} /></button></div>
                        </div>

                        <div className='  mb-[24px] '>
                            <h1 className=' text-center'>Are you sure you want to remove  <span className=' text-[#575757] font-[700]'>
                                {selectedUser?.name}  </span> from your budget?</h1>

                        </div>

                        <div className=' flex gap-[16px] items-center'>
                            <button onClick={() => handleRemoveUser(selectedUser)} className=' px-[25px] py-[14px] rounded-[32px]  bg-[#F7F7F9] text-[#575757] '>Yes, remove</button>
                            <button onClick={() => setRemoveGuestModal(!removeGuestModal)} className=' py-[14px] px-[59px] bg-[#121212] rounded-[32px] text-white'>No</button>
                        </div>
                    </div>
                </motion.div>
            }
        </div>
    )
}

export default Page;
