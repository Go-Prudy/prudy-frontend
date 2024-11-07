'use client'
import Header from '@/components/header'
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { BsCamera, BsPerson } from 'react-icons/bs';
import Image from 'next/image';
import cameraIcon from '@/images/camera.png'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; // Import default styles

const Page = () => {
    const [value, setValue] = useState<any | undefined>()
    return (
        <div className=' relative h-screen'
        >
            <motion.div
                initial={{ x: '100%' }}  // Start from the right side of the screen
                animate={{ x: 0 }}      // Move to the normal position
                exit={{ x: '-100%' }}   // Optionally, move out to the left when unmounted
                transition={{ type: 'tween', stiffness: 600 }}  // Customize the animation
            >
                <div className=' relative'
                >
                    <Header link={`/profile`} title="Profile" />
                    <div className='flex w-full justify-center'>
                        <div className='bg-white border mt-[30px]  p-2 rounded-full relative w-[100px] h-[100px] flex items-center justify-center '>
                            {/* Profile Picture */}

                            <BsPerson className='text-[#040404] w-[100px] h-[100px]' />
                            <Image className=' absolute top-[73%]  right-0  h-[32px] w-[32px]   rounded-full shadow-md ' alt='premium' width={1000} height={1000} src={cameraIcon} />
                        </div>
                    </div>

                    <div className=' flex flex-col gap-[16px] p-[24px]'>
                        <label className=' flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]' htmlFor="">
                            <h1 className=' text-[12px] text-[#575757] leading-[16px] '>First name</h1>
                            <input placeholder='Enter First Name' className=' bg-[#ff000000] outline-none  font-[500] leading-[24px]' type="text" name="" id="" />
                        </label>
                        <label className=' flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]' htmlFor="">
                            <h1 className=' text-[12px] text-[#575757] leading-[16px] '>Last name</h1>
                            <input placeholder='Enter Last Name' className=' bg-[#ff000000] outline-none  font-[500] leading-[24px]' type="text" name="" id="" />
                        </label>
                        <label className=' flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]' htmlFor="">
                            <h1 className=' text-[12px] text-[#575757] leading-[16px] '>Email address</h1>
                            <input placeholder='Enter email' className=' bg-[#ff000000] outline-none  font-[500] leading-[24px]' type="email" name="" id="" />
                        </label>
                        <label className=' flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]' htmlFor="">
                            <h1 className=' text-[12px] text-[#575757] leading-[16px] '>Phone number</h1>
                            <div >
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
                            </div>
                        </label>
                    </div>

                </div>
            </motion.div>
        </div>
    )
}

export default Page