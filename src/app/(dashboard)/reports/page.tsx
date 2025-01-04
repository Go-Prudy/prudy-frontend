import Header from '@/components/header'
import Image from 'next/image'
import React from 'react'
import launch from '/public/images/Launch.png'
const page = () => {
    return (
        <div className="bg-[#FAFAFA] w-full h-screen">
            <Header link={`/profile`} title="Reports" />
            <div
                className=' mt-[24px] flex justify-center text-[#2D2D2D] flex-col w-full  items-center'
            >
                <h1 className=' mb-[24px] text-center text-[#575757]'>Export your transactions and use them in spreadsheets</h1>

                <Image src={launch} className="h-[141.27px] w-[126.52px] " height={1000} width={1000} alt=" icon" />
                <h1 className=' mt-[16px] '>Coming soon 🚀</h1>
            </div>

        </div>
    )
}

export default page