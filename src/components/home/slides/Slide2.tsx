import Image from 'next/image'
import React from 'react'
import Logo from '/public/images/logo2.webp';

const Slide2 = () => {
    return (
        <div className='  bg-gradient-to-b  flex flex-col gap-[16px] justify-center items-center  top-0 to-[#ffffff]  from-[#ffffff] '>
            <Image className=' size-[80px] object-contain' src={Logo} width={1000} height={1000} alt='logo' />
            <h1 className=' font-[700] italic text-[39.14px] text-[#101C04]  leading-[41.59px] '>GoPrudy</h1>
            <p className=' text-[#575757] leading-[19.2px]'>Don’t take the back seat, be in charge!</p>

        </div>
    )
}

export default Slide2