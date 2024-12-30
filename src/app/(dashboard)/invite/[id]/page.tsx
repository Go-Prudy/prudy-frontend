'use client'
import Slide1 from '@/components/home/slides/Slide1'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {
    const navigate = useRouter()

    useEffect(() => {
        navigate.push('/budgets'); // Replace '/budgets' with your actual budgets page route
    }, [navigate]);

    return (
        <div>
            <Slide1 />
        </div>
    )
}

export default Page