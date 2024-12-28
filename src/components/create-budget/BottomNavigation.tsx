'use client'
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import Image from 'next/image';
import home from "@/images/home.webp"
import hambugger from "@/images/hambugger.png"
import home1 from "@/images/home1.webp"
import track from '@/images/note.webp'
import track1 from '@/images/note1.webp'
import status from '@/images/status.webp'
import status1 from '@/images/status1.png'
import profile from '@/images/user.png'
import profile1 from '@/images/user1.webp'

import Link from 'next/link';
const BottomNavigation = () => {
    const pathname = usePathname()
    const [currentRoute, setCurrentRoute] = useState<string | null>(pathname);

    useEffect(() => {
        // Only run this code on the client-side
        if (typeof window !== 'undefined') {
            setCurrentRoute(pathname);
        }
    }, [pathname]);

    return (
        <div className='fixed z-30 w-[100vw] max-w-[500px]    bg-white bottom-0'>
            {/* <ul className="flex justify-around p-[12px]">
                <Link href={'/budgets'} className={` text-[12px] font-[500]  ${currentRoute === '/budgets' ? ' text-[#66C227]  ' : 'non-active text-[#828282]'}  flex justify-center items-center flex-col max-w-[56px] py-[7px]`}>
                    {currentRoute === '/budgets' ? <Image className=' size-[24px] ' alt='home' src={home1} width={1000} height={1000} /> : <Image className=' size-[24px] ' alt='home' src={home} width={1000} height={1000} />}
                    Home
                </Link>
                <Link href={'/budgets/track'} className={` text-[12px] font-[500] ${currentRoute === '/budgets/track' ? ' text-[#66C227]  ' : 'non-active text-[#828282]'}  flex justify-center items-center flex-col max-w-[56px] py-[7px]`}>
                    {currentRoute === '/budgets/track' ? <Image className=' size-[24px] ' alt='track' src={track1} width={1000} height={1000} /> : <Image className=' size-[24px] ' alt='track' width={1000} height={1000} src={track} />}
                    Track
                </Link>
                <Link href={'/budgets/analytics'} className={` text-[12px] font-[500] ${currentRoute === '/budgets/analytics' ? ' text-[#66C227]  ' : 'non-active text-[#828282]'}  flex justify-center items-center flex-col max-w-[56px] py-[7px]`}>
                    {currentRoute === '/budgets/analytics' ? <Image className=' size-[24px] ' alt='analytics' width={1000} height={1000} src={status1} /> : <Image className=' size-[24px] ' width={1000} height={1000} alt='track' src={status.src} />}
                    analytics
                </Link>
                <Link href={'/budgets/analytics'} className={` text-[12px] font-[500] ${currentRoute === '/budgets/analytics' ? ' text-[#66C227]  ' : 'non-active text-[#828282]'}  flex justify-center items-center flex-col max-w-[56px] py-[7px]`}>
                    {currentRoute === '/budgets/analytics' ? <Image className=' size-[24px] ' alt='analytics' width={1000} height={1000} src={profile1.src} /> : <Image className=' size-[24px] ' width={1000} height={1000} alt='track' src={profile} />}
                    Profile
                </Link>




            </ul> */}
        </div>
    );
};

export default BottomNavigation;
