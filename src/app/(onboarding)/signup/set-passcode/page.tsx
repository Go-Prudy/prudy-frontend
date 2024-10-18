'use client'
import Header from '@/components/header';
import Input from '@/components/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthentication } from '@/app/store/AuthStore';
import { useMutation } from '@tanstack/react-query';
import { signupUser } from '@/app/services/AuthenticationService';
import { toast } from 'react-hot-toast';
import { SignupForm } from '@/app/Types';
import { CircularProgress } from '@nextui-org/react';

const Page = () => {
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { signup, form } = useAuthentication();
    const navigate = useRouter();





    const setPasscodeMutation = useMutation({
        mutationFn: async (data: SignupForm) => {
            setIsLoading(true);
            const result = await signupUser(data);
            setIsLoading(false);

            const newData: any = { ...form, pin: password, confirmPin: confirmPassword }
            signup(newData)

            // Navigate to the next step or page

            navigate.push('/login')
            return result;
        },
        onSuccess: (data: any) => {
            if (data?.success) {
                console.log(data);
            }
        },
        onError: (error: any) => {
            setIsLoading(false);
            console.error(error?.response.data.message);
            toast.error(error?.response.data.message);
        },
    });



    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Validate password length
        if (password.length < 6 || confirmPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        const newData: any = { ...form, pin: password, confirmPin: confirmPassword }

        setPasscodeMutation.mutateAsync(newData)

        // Validate if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError(''); // Clear the error message


    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[100vw]">
            <Header link={'/signup/verify'} title="Create account" />
            <div className="px-6 py-10">
                <div className="w-full">
                    <p className="mb-6 font-[500] text-[20px] leading-[28px] text-[#2D2D2D]">Set your passcode</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Passcode"
                        inputName="Passcode"
                        inputType="password"
                        maxLength={6}
                        placeholder="Enter your passcode"
                        onChange={(value) => setPassword(value)}
                    />
                    <Input
                        label="Confirm passcode"
                        inputName="Confirm your passcode"
                        inputType="password"
                        maxLength={6}
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

                            {
                                isLoading ? <CircularProgress color='default' className=' text-[#ae3d3d] flex mx-auto justify-center ' size='sm' /> : 'Sign Up'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default Page;
