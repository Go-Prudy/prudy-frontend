'use client'
import Header from '@/components/header';
import GoogleLogo from '@/icons/google-logo';
import Link from 'next/link';
import Input from '@/components/input';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const LoginPage = () => {

  const [email, setEmail] = useState<string>('');
  const [passcode, setPasscode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useRouter();


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // // Validate password length
    // if (passcode.length < 6) {
    //   setError('Password must be at least 6 characters long');
    //   return;
    // }


    // setError(''); // Clear the error message
    console.log({ passcode, email });

    // Navigate to the next step or page
    navigate.push('/budgets')
  };

  return (

    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-[100vw]">
      <Header link='' title="Sign in" />
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-[24px]">
          <div className="w-full mb-6">
            <p className="mb-6 font-[500] text-[20px] leading-[28px] text-[#2D2D2D]">Sign in to your account</p>
            <button type='button' className=" w-full py-[16px] gap-[8px] rounded-[20px] text-[#575757] justify-center inline-flex flex-col items-center bg-[#F7F7F9] border border-[#EFEFF0]">
              <GoogleLogo scale={24} />
              <p className=' text-[12px] leading-[14.4px]'>Google</p>
            </button>
          </div>



          <Input label="Email address" inputName="email" inputType="email" placeholder="example@email.com" onChange={(value) => setEmail(value)} />
          <Input label="Passcode" inputName="passcode" inputType="number" placeholder="Enter your passcode" onChange={(value) => setPasscode(value)} />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <p className="flex font-medium justify-end gap-2">
            <Link href="/forgot-password" className="text-[#575757]">
              Forgot passcode?
            </Link>
          </p>

        </div>

        <div className=" m-0 mb-[24px] flex w-full items-center bg-white px-6  rounded-t-3xl ">
          <button className="h-12 font-[500] text-white bg-black rounded-3xl w-full">Sign in</button>
        </div>
      </form>

      <p className="flex font-medium justify-center gap-2">
        <span className="text-[#575757]">Don’t have an account? </span>{' '}
        <Link href="/signup" className="text-lemonGreen-700">
          Signup
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginPage;
