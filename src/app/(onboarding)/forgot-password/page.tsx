'use client';

import Header from '@/components/header';
import React, { useEffect } from 'react';
import axios from 'axios';
import { BsCheck } from 'react-icons/bs'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const VerifyOtpPage = () => {
    const inputLength = 6;
    const [otpValues, setOtpValues] = React.useState<string[]>(Array(inputLength).fill(''));
    const [focusedInput, setFocusedInput] = React.useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null | any>(null);
    const navigate = useRouter();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const otp = otpValues.join('');

        try {
            // Simulate API request
            // const response = await axios.post('/api/verify-otp', { otp });
            setSuccess('Success');
            // Handle success (e.g., redirect or show a success message)
        } catch (err) {
            setError('Failed to verify OTP. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        // Auto-submit when all OTP fields are filled
        if (otpValues.every(value => value.length > 0)) {
            handleSubmit(); // Trigger form submission
        }
    }, [otpValues]);

    useEffect(() => {
        if (success?.length > 2) {
            setTimeout(() => {
                navigate.push('/remember-passcode');
            }, 2000);
        }
    }, [success, navigate]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }} className="w-full">
            <Header link={'/signup/'} title="Remember passcode" />
            <form id="otp-form" className="pt-10 px-6" onSubmit={e => e.preventDefault()}>
                <h1 className=' font-[500] text-[20px] leading-[28px] '>Forgot passcode?</h1>
                <p className="font-medium text-[#828282] mt-[16px] mb-6">
                    Enter 6 digit pin sent to your email/phone number
                </p>
                <div className="flex items-center gap-2 mb-6 justify-between">
                    {Array.from({ length: inputLength }).map((_, index) => (
                        <OtpInput
                            key={index}
                            index={index}
                            otpValues={otpValues}
                            setOtpValues={setOtpValues}
                            inputLength={inputLength}
                            focusedInput={focusedInput}
                            setFocusedInput={setFocusedInput}
                        />
                    ))}
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <div className=' flex items-start  gap-x-[8px] '>
                    <BsCheck className=' size-[16px]  text-[#219653] ' />

                    <p className="text-[#219653] block text-[12px] mb-4">{success}</p>
                </div>
                }
                {/* <div className={`sticky  transition-all ease-out delay-100 bottom-0 flex w-full items-center bg-white mb-3 ${success ? 'hidden' : 'block'}`}>
          <button
            type="submit"
            className={`h-12 font-[500] text-white bg-black rounded-3xl w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </button>
        </div> */}
                <button className={`font-medium flex justify-center w-full mx-auto text-lemonGreen-700 ${success ? ' mt-[38px] ' : 'flex'}`}>Resend code</button>
            </form>
        </motion.div>
    );
};

type OtpInputProps = {
    index: number;
    otpValues: string[];
    setOtpValues: React.Dispatch<React.SetStateAction<string[]>>;
    inputLength: number;
    focusedInput: number | null;
    setFocusedInput: React.Dispatch<React.SetStateAction<number | null>>;
};

const OtpInput = ({
    index,
    otpValues,
    setOtpValues,
    inputLength,
    focusedInput,
    setFocusedInput,
}: OtpInputProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        const validKeys = /^[0-9]{1}$|Backspace|Delete|Tab|Meta/;
        if (!validKeys.test(e.key)) {
            e.preventDefault();
        }

        if (e.key === 'Backspace' || e.key === 'Delete') {
            if (index > 0) {
                setOtpValues((prev) => [
                    ...prev.slice(0, index),
                    '',
                    ...prev.slice(index + 1),
                ]);
                setFocusedInput((prev) => (prev && prev > 0 ? prev - 1 : prev));
            }
        }
    };

    const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = e.target.value;
        setOtpValues((prev) => [
            ...prev.slice(0, index),
            value,
            ...prev.slice(index + 1),
        ]);

        if (value && index < inputLength - 1) {
            setFocusedInput(index + 1);
        }
    };

    const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
        e.target.select();
    };

    const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text');
        if (/^\d{6}$/.test(text)) {
            const digits = text.split('');
            setOtpValues((prev) => [
                ...prev.slice(0, index),
                digits[index],
                ...prev.slice(index + 1),
            ]);
        }
    };

    React.useEffect(() => {
        if (focusedInput === index && inputRef.current) {
            inputRef.current.focus();
        }
    }, [focusedInput, index]);

    React.useEffect(() => {
        if (otpValues[index] && inputRef.current) {
            inputRef.current.value = otpValues[index];
        }
    }, [otpValues, index]);

    const isFilled = !!otpValues[index];

    return (
        <input
            type="text"
            autoComplete="new-password"
            className={`w-12 h-[56px] text-center font-extrabold text-slate-900 border border-[#EFEFF0] rounded-2xl p-2 outline-none 
        ${isFilled ? 'bg-[#E6F8EF] text-slate-900' : 'bg-[#F7F7F9]'} 
        ${isFilled ? 'text-black' : 'text-slate-900'} 
        focus:border-lemonGreen-700 focus:ring-2 focus:ring-indigo-100`}
            pattern="\d*"
            maxLength={1}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onPaste={handlePaste}
            ref={inputRef}
            value={otpValues[index]}
        />
    );
};

export default VerifyOtpPage;
