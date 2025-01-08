import Image from 'next/image'
import React from 'react'
import logo from '/public/images/logo-1.png';
import linkdein from '/public/images/linkdein.png';
import facebook from '/public/images/facebook.png';
import instagram from '/public/images/instagram.png';
import gf from '/public/images/gf.gif';
import x from '/public/images/x.png';
import header from '/public/images/template 1-header.png';

const Page = () => {
    return (
        <div className='w-full min-h-screen px-[24px] bg-[#F7F7F9] overflow-y-auto will-change-scroll md:px-[40px] lg:px-0'>
            <div className='relative h-fit max-w-[640px] mx-auto'>
                <div className="text-[hsl(0,0%,100%)] min-h-[120px] text-center pt-[28.64px] pb-[18.64px] flex justify-center gap-[4px] w-full" style={{
                    background: 'linear-gradient(0deg, #66C227 15.2%, #2A860A 74.4%)',
                }}>
                    <Image className='size-[29.28px]' width={1000} height={1000} src={logo} alt="logo" />
                    <h1 className='italic text-[27.7px] text-center font-[700] text-[#FFFFFF] leading-[27.7px]'>GoPrudy</h1>
                </div>
                <div className='h-full w-full absolute mt-[75px] top-0  left-0  z-10'>
                    <div className='bg-white rounded-[32px] p-[40px]'>

                        <div className=' bg-[#ECF7E2] tex-center rounded-t-[20px] flex gap-[15px] items-center py-[28px]'>
                            <Image className='w-[128px] absolute left-[-20px] h-[72px]' width={1000} height={1000} src={gf} alt="logo" />
                            <h1 className=' font-[700] text-[24px] mx-auto text-center '>Glad You’re Ready to <span className=' text-[#66C227] italic'>‘Go Prudy’</span> </h1>
                            <Image className='w-[128px] absolute right-[-20px] h-[72px]' width={1000} height={1000} src={gf} alt="logo" />
                        </div>


                        <section className='text-[14px] pt-[16px]  bg-white'>
                            {/* BODY OF THE EMAIL */}
                            <h1 className='text-[#2d2d2d] mb-[24px] leading-[16.8px]'>Hey (first name),</h1>
                            <h1 className='text-[#2d2d2d] mb-[24px] leading-[16.8px]'>We’re so glad you’re here!</h1>
                            <h1 className='text-[#2d2d2d] mb-[24px] leading-[24px]'>Prudy is pleased to meet you, and we can’t wait to be a part of your financial journey. Whether you’re looking to get smarter about your spending, hit some money goals, or simply understand where your money is going, we’re here to put the power in your hands.</h1>

                            <h1 className='text-[#2d2d2d] mb-[24px] leading-[24px]'>Here’s what we’re bringing to the table:</h1>

                            <ul className='list-disc pl-[20px] flex flex-col gap-[12px] mb-[24px] leading-[24px]'>
                                <li className='text-[14px] font-[400]'><span className='font-[700]'>Total Transparency</span> – With Prudy, you see where every naira goes and can start taking control of your finances with full clarity.</li>
                                <li className='text-[14px] font-[400]'><span className='font-[700]'>Budgets That Work for You</span> – Create budgets that are flexible enough to meet your lifestyle needs. Prudy makes it easy to stay on track, no matter what.</li>
                                <li className='text-[14px] font-[400]'><span className='font-[700]'>Personalised Insights</span> – As your money buddy, we’ll share insights to help you make the most of every spend and how you can do better.</li>
                            </ul>

                            <h1 className='text-[#2d2d2d] mb-[24px] leading-[24px]'>Log into your dashboard, set your first budget, and let us do the rest.</h1>

                            <h1 className='text-[#2d2d2d] mb-[24px] leading-[24px]'>We’re excited to be on this journey with you!</h1>

                            <h1 className='text-[#2d2d2d] mb-[24px] leading-[24px]'>We’re excited to be on this journey with you!</h1>
                            <h1 className='text-[#2d2d2d] mb-[24px] leading-[24px]'>If you ever need us, Prudy’s support team is here to help. Just reply to this email or drop a message in the app anytime.</h1>
                            <h1 className='text-[#2d2d2d] mb-[24px] leading-[24px]'>Your finance buddy,<br />
                                Prudy!</h1>
                        </section>

                        <section className='flex flex-col justify-center rounded-[12px] items-center bg-[#F7F7F9] p-[24px] gap-[16px]'>
                            {/* FOOTER */}
                            <div className='flex flex-row items-center gap-[16px]'>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                    <Image className='size-[20px]' width={1000} height={1000} src={x} alt="x" />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                    <Image className='size-[20px]' width={1000} height={1000} src={instagram} alt="instagram" />
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                    <Image className='size-[20px]' width={1000} height={1000} src={facebook} alt="facebook" />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                    <Image className='size-[20px]' width={1000} height={1000} src={linkdein} alt="linkdein" />
                                </a>
                            </div>
                            <h1 className='text-[#2D2D2D] flex items-center gap-[4px] text-[12px]'>
                                <a href="mailto:goprudyhq@gmail.com">goprudyhq@gmail.com</a>
                                |
                                <a href="tel:+919876543210">+91 9876543210</a>
                            </h1>
                            <div className='w-full'>
                                <hr className='border-[#E7E7EA] w-full' />
                            </div>
                            <div className='w-full justify-center flex gap-[4px]'>
                                <Image className='size-[13.4px]' width={1000} height={1000} src={logo} alt="logo" />
                                <h1 className='italic text-[12.7px] text-center font-[700] text-[#000000] leading-[27.7px]'>GoPrudy</h1>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page