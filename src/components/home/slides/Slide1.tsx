'use client'
import React from 'react'
import Logo from '@/images/logo.webp';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Slide2 from './Slide2';
import Logo2 from '@/images/logo2.webp';
const Slide1 = () => {
    return (
        <div className=' relative  '>
            <div className='  bg-gradient-to-b fixed h-[100vh] flex justify-center items-center w-[100vw] top-0 to-[#66C227]  from-[#2A860A] '>
                <motion.div
                    initial={{ opacity: 1, }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Image className=' size-[80px] object-contain' src={Logo} width={1000} height={1000} alt='logo' />
                </ motion.div>
            </div>
            <div

                className=" m-auto fixed top-0 left-0 h-[100vh] w-[100vw] grid place-content-center  rounded-full   "
            >
                <motion.div
                    initial={{ opacity: 0, height: '20rem', width: '20rem', borderRadius: '200rem' }}
                    animate={{ opacity: 1, scale: 1, height: '90rem', borderRadius: '0%', width: '90rem' }}
                    transition={{ duration: 1.9 }}

                    className='  bg-gradient-to-b    flex flex-col gap-[16px] justify-center items-center  top-0 to-[#ffffff]  from-[#ffffff] '>
                    <Image className=' size-[80px] object-contain' src={Logo2} width={1000} height={1000} alt='logo' />
                    <h1 className=' font-[700] italic text-[39.14px] text-[#101C04]  leading-[41.59px] '>GoPrudy</h1>
                    <p className=' text-[#575757] leading-[19.2px]'>Don’t take the back seat, be in charge!</p>

                </ motion.div>
            </div>

        </div >
    )
}

export default Slide1