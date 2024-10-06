'use client'

import Header from '@/components/header'
import Image from 'next/image'
import React, { useState } from 'react'
import launch from '@/images/Launch.png'
import { motion } from 'framer-motion';
import SuccessModal from '../../components/SuccessModal'
const Page = () => {
    // State for passcodes
    const [oldPasscode, setOldPasscode] = useState('');
    const [passCodeSuccess, setPassCodeSuccess] = useState(false);
    const [newPasscode, setNewPasscode] = useState('');
    const [confirmPasscode, setConfirmPasscode] = useState('');

    // Handle passcode change
    const handleChangePasscode = () => {
        console.log('Old Passcode:', oldPasscode);
        console.log('New Passcode:', newPasscode);
        console.log('Confirm Passcode:', confirmPasscode);
        setPassCodeSuccess(!passCodeSuccess)
        // Add any additional logic here, such as validation or API calls
    }

    return (
        <div className="bg-[#FAFAFA] w-full h-screen">
            <Header link={`/profile`} title="Passcode Settings" />

            <div className="mt-[24px] flex text-[#2D2D2D] flex-col w-full px-[24px]">
                <div>
                    <h1 className="mb-[24px] font-[500] leading-[28px] text-[#575757]">Change your passcode</h1>

                    {/* Old Passcode */}
                    <label className="flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]" htmlFor="oldPasscode">
                        <h1 className="text-[12px] text-[#575757] leading-[16px]">Old passcode</h1>
                        <input
                            placeholder="Enter current passcode"
                            className="bg-[#ff000000] outline-none font-[500] leading-[24px]"
                            type="password"
                            value={oldPasscode}
                            onChange={(e) => setOldPasscode(e.target.value)}
                            id="oldPasscode"
                        />
                    </label>
                </div>

                {/* New Passcode */}
                <div>
                    <h1 className="mb-[24px] font-[500] leading-[28px] text-[#575757]">New passcode</h1>

                    <label className="flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]" htmlFor="newPasscode">
                        <h1 className="text-[12px] text-[#575757] leading-[16px]">New passcode</h1>
                        <input
                            placeholder="Enter new passcode"
                            className="bg-[#ff000000] outline-none font-[500] leading-[24px]"
                            type="password"
                            value={newPasscode}
                            onChange={(e) => setNewPasscode(e.target.value)}
                            id="newPasscode"
                        />
                    </label>

                    {/* Confirm New Passcode */}
                    <label className="mt-[16px] flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]" htmlFor="confirmPasscode">
                        <h1 className="text-[12px] text-[#575757] leading-[16px]">Confirm new passcode</h1>
                        <input
                            placeholder="Confirm new passcode"
                            className="bg-[#ff000000] outline-none font-[500] leading-[24px]"
                            type="password"
                            value={confirmPasscode}
                            onChange={(e) => setConfirmPasscode(e.target.value)}
                            id="confirmPasscode"
                        />
                    </label>
                </div>

                {/* Change passcode button */}
                <button
                    onClick={handleChangePasscode}
                    className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center mt-[24px] justify-center gap-[8px] font-[500]"
                >
                    Change passcode
                </button>
            </div>



            {passCodeSuccess &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[100vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                >

                    <SuccessModal
                        showModal={passCodeSuccess}
                        setShowModal={setPassCodeSuccess}
                        handleClose={() => console.log('Modal closed')}
                        text='Removed successfully'
                    />

                </motion.div>
            }

        </div>
    )
}

export default Page
