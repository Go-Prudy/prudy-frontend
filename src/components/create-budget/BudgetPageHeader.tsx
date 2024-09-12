'use client'
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BsBell, BsPerson } from 'react-icons/bs';
import hambugger from "@/images/hambugger.png";
import premium from "@/images/premium.png";
import close from "@/images/close.png";
import Link from 'next/link';
import home from "@/images/home.webp";
import home1 from "@/images/home1.webp";
import track from '@/images/note.webp';
import track1 from '@/images/note1.webp';
import status from '@/images/status.webp';
import status1 from '@/images/status1.png';
import profile from '@/images/profile-circle.png';
import profile1 from '@/images/profile-circle 2.png';
import setting from '@/images/setting-3.png';
import setting1 from '@/images/setting-3 2.png';
import upgrade from '@/images/upgrade.png';

const BudgetPageHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

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

    const pathname = usePathname();
    const [currentRoute, setCurrentRoute] = useState<string | null>(pathname);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentRoute(pathname);
        }
    }, [pathname]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className={`z-[20] fixed top-0 pt-[24px] px-[24px] flex justify-between backdrop-brightness-105 backdrop-blur-lg text-white w-full items-center pb-[16px] transition-all duration-300 ${scrolled ? 'scrolled-bg' : 'bg-[#00000064]'}`}>
            {/* Left Section: Profile */}
            <div className='text-white flex gap-[8px] items-start'>
                <div className='rounded-full p-1 border border-[white]'>
                    <BsPerson className='text-white size-[38px]' />
                </div>
                <div>
                    <h1 className='text-[12px] leading-[16px]'>Welcome 👋</h1>
                    <h1 className='font-[500] leading-[24px]'>Ayomide</h1>
                </div>
            </div>

            {/* Middle Section: Hamburger Icon */}

            {!menuOpen && <div className='size-[48px] flex items-center'>
                <Image className='size-[48px] cursor-pointer' alt='hamburger' width={1000} height={1000} src={hambugger} onClick={toggleMenu} />
            </div>}

            {/* Menu: Left Sliding */}

            <div className={` fixed w-full ${!menuOpen ? 'left-[-500rem]' : 'left-0'} duration-100 transition-all ease-in  top-0 h-[100vh] z-50 `}>
                <div className='relative w-full'>
                    <div className='bg-white w-[295px] h-[100vh] overflow-y-scroll z-10 relative py-[48px] px-[24px] transition-transform duration-300' style={{ transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
                        <div className='flex items-start gap-[8px]'>
                            <div className='flex items-center rounded-full p-1 border border-[#101010]'>
                                <BsPerson className='text-black size-[38px]' />
                            </div>
                            <div className='flex gap-[4px] flex-col'>
                                <h1 className='font-[500] text-black leading-[24px]'>Ayomide Asekun</h1>
                                <Image className='backdrop-blur-3xl w-[74px] h-[20px]' alt='premium' width={1000} height={1000} src={premium} />
                            </div>
                        </div>

                        {/* Menu Links */}
                        <ul className="flex mt-[40px] gap-[12px] flex-col justify-around ">
                            <Link href='/budgets' className={`p-[12px] rounded-[12px] w-[247px] h-[48px] flex items-center py-[7px] gap-[8px] ${currentRoute === '/budgets' ? 'bg-[#ECFDDC] text-[#66C227]' : 'text-[#828282]'}`}>
                                {currentRoute === '/budgets' ? <Image className='size-[24px]' alt='home' src={home1} width={1000} height={1000} /> : <Image className='size-[24px]' alt='home' src={home} width={1000} height={1000} />}
                                Home
                            </Link>
                            <Link href='/budgets/track' className={`p-[12px] rounded-[12px] w-[247px] h-[48px] flex items-center py-[7px] gap-[8px] ${currentRoute === '/budgets/track' ? 'bg-[#ECFDDC] text-[#66C227]' : 'text-[#828282]'}`}>
                                {currentRoute === '/budgets/track' ? <Image className='size-[24px]' alt='track' src={track1} width={1000} height={1000} /> : <Image className='size-[24px]' alt='track' src={track} width={1000} height={1000} />}
                                Track
                            </Link>
                            <Link href='/budgets/analysis' className={`p-[12px] rounded-[12px] w-[247px] h-[48px] flex items-center py-[7px] gap-[8px] ${currentRoute === '/budgets/analysis' ? 'bg-[#ECFDDC] text-[#66C227]' : 'text-[#828282]'}`}>
                                {currentRoute === '/budgets/analysis' ? <Image className='size-[24px]' alt='analysis' src={status1} width={1000} height={1000} /> : <Image className='size-[24px]' alt='analysis' src={status} width={1000} height={1000} />}
                                Analysis
                            </Link>
                            <Link href='/profile' className={`p-[12px] rounded-[12px] w-[247px] h-[48px] flex items-center py-[7px] gap-[8px] ${currentRoute === '/profile' ? 'bg-[#ECFDDC] text-[#66C227]' : 'text-[#828282]'}`}>
                                {currentRoute === '/profile' ? <Image className='size-[24px]' alt='profile' src={profile1} width={1000} height={1000} /> : <Image className='size-[24px]' alt='profile' src={profile} width={1000} height={1000} />}
                                Profile
                            </Link>
                            <Link href='/settings' className={`p-[12px] rounded-[12px] w-[247px] h-[48px] flex items-center py-[7px] gap-[8px] ${currentRoute === '/settings' ? 'bg-[#ECFDDC] text-[#66C227]' : 'text-[#828282]'}`}>
                                {currentRoute === '/settings' ? <Image className='size-[24px]' alt='profile' src={setting1} width={1000} height={1000} /> : <Image className='size-[24px]' alt='profile' src={setting} width={1000} height={1000} />}
                                Settings
                            </Link>
                        </ul>

                        <div className=' text-black mt-[176px] border-[#EFEFF0] flex flex-col gap-[16px] border bg-[#F7F7F9] p-[16px] w-full justify-center items-center rounded-[24px]  '>
                            <Image className=' h-[60px] w-[54px] ' alt='close' width={1000} height={1000} src={upgrade} />
                            <h1>Do a lot more with GoPrudy</h1>
                            <button className=' w-full bg-[black] text-center text-white py-[16px] rounded-[32px] '>
                                Upgrade now
                            </button>
                        </div>
                    </div>
                    <div className='absolute top-0 left-0 h-[100vh] bg-[#6262628d] backdrop-blur-3xl w-[100vw]' onClick={toggleMenu} />
                    <Image className=' size-[48px] top-[24px] absolute right-[24px] cursor-pointer' alt='close' width={1000} height={1000} src={close} onClick={toggleMenu} />
                </div>
            </div>

        </div>
    );
};

export default BudgetPageHeader;
