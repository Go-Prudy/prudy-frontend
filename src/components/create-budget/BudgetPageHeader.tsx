import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { BsBell, BsPerson } from 'react-icons/bs'

const BudgetPageHeader = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <div
            className={`z-[20] fixed top-0 pt-[48px] px-[24px] flex justify-between backdrop-brightness-105 backdrop-blur-lg text-white w-full items-center pb-[16px] transition-all duration-300 ${scrolled ? 'scrolled-bg' : 'bg-[#00000064]'
                }`}
        >
            <div className=' text-white flex gap-[8px] items-start'>
                <div className=' rounded-full p-1 border border-[white]'>
                    <BsPerson className=' text-white size-[38px] ' />
                </div>
                <div>
                    <h1 className=' text-[12px] leading-[16px] '>Welcome 👋</h1>
                    <h1 className=' font-[500] leading-[24px] '>Ayomide</h1>
                </div>
            </div>

            <div className=' size-[48px] flex justify-center items-center bg-[#FFFFFF0A] rounded-[32px] '>
                <BsBell className=' size-[20px] ' />
            </div>

        </div>
    )
}

export default BudgetPageHeader