'use client'
import Header from '@/components/header';
import Input from '@/components/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import succes from '@/images/success-pJCKblmrv2.png'
import Image from 'next/image';
import { motion } from 'framer-motion';

const Page = () => {
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useRouter();
    const [showModal, setShowModal] = useState<boolean>(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validate password length
        if (password.length < 8 || confirmPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        // Validate if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError(''); // Clear the error message
        setShowModal(true)

        // Navigate to the next step or page
        // navigate.push('/login')
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-[500px] h-[100vh] ">
            <Header link={'/signup/verify'} title="Remember passcode" />
            <div className="px-6 py-10">
                <div className="w-full">
                    <p className="mb-6 font-[500] text-[20px] leading-[28px] text-[#2D2D2D]">Reset passcode</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Passcode"
                        inputName="Passcode"
                        inputType="password"
                        placeholder="Enter your passcode"
                        onChange={(value) => setPassword(value)}
                    />
                    <Input
                        label="Confirm passcode"
                        inputName="Confirm your passcode"
                        inputType="password"
                        placeholder="Confirm your passcode"
                        onChange={(value) => setConfirmPassword(value)}
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                    <div className="m-0 mt-[38px] flex w-full items-center bg-white rounded-t-3xl">
                        <button
                            type="submit"
                            className={`h-12 text-white font-[500] bg-black rounded-3xl w-full `}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>



            {/* MODAL */}

            {showModal && <div className=' fixed top-0 h-[100vh] max-w-[500px]  bg-[#2b2b2b54] backdrop-blur-sm justify-center flex flex-col items-center '>
                <div className=' text-center bg-white rounded-[40px] p-[40px] h-[341px] flex flex-col justify-center items-center gap-[19px] w-[90%]'>

                    <Image src={succes} alt={'success'} className=' size-[80px] ' width="1000" height="1000" />
                    <h1 className=' text-[20px] font-[500] '>Success 🎊</h1>
                    <p>Your password has been reset successfully</p>
                    <button
                        type="button"
                        onClick={() => navigate.push('/login')}
                        className={`h-12 text-white font-[500] bg-black rounded-3xl w-full `}
                    >
                        Login
                    </button>
                </div>
            </div>
            }

        </motion.div>
    );
};

export default Page;
