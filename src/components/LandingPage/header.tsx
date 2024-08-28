import Image from 'next/image'
import React from 'react'
import logo from '@/images/logo3.webp'
import Link from 'next/link'
import { Button } from '@nextui-org/react'

const Header = () => {
    const nav = [
        {
            id: 1,
            text: 'Budget',
            link: '/budgets'
        },
        {
            id: 1,
            text: 'Collaborate',
            link: '/collaborate'
        },
        {
            id: 1,
            text: 'Track',
            link: '/track'
        },
    ]
    return (
        <div className=' px-[120px] z-20 fixed top-0 text-[#EFEFF0] flex justify-between  backdrop-blur w-[100vw] bg-[#070D041A] items-center py-[24px] '>
            <div>
                <Image src={logo} alt='' width={1000} height={1000} className=' w-[120.97px] h-[28.32px] ' />
            </div>
            <div className=' flex items-center gap-[24px] '>
                {nav.map((i, id) => (
                    <Link className='text-[14px] leading-[20px]' key={id} href={i.link}>{i.text}</Link>
                ))}
            </div>
            <Button className='text-[14px] text-[#EFEFF0]  bg-[#2D2D2D]  leading-[20px]' >Join waitlist</Button>


        </div>
    )
}

export default Header