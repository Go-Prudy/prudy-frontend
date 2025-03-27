'use client';
import Header from '@/components/header';
import Input from '@/components/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthentication } from '@/app/store/AuthStore';
import { Button } from '@nextui-org/react';

const Page = () => {
  const navigate = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string | number | any>('');
  const [error, setError] = useState<string>('');

  const { signup, form } = useAuthentication();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const newData = { ...form, }

    // Validate password length
    if (phoneNumber.length < 10) {
      setError('PhoneNumber must be at least 10 characters long');
      return;
    }

    setError(''); // Clear the error message
    // console.log({ phoneNumber });

    // Navigate to the next step or page
    navigate.push('/signup/verify');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[500px] h-[100vh] "
    >
      <Header link={'/signup/verify'} title="Create account" />
      <div className="px-6 py-10">
        <div className="w-full">
          <p className="mb-6 font-[500] text-[20px] leading-[28px] text-[#2D2D2D]">
            Enter your phone number
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            label="Phone number"
            inputName="phoneNumber"
            inputType="text"
            // onChange={(value) => setPhoneNumber(value)}
            placeholder="0123456789"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className=" m-0 mt-[38px] flex w-full items-center bg-white  rounded-t-3xl ">
            <Button
              type="submit"
              className="h-12  text-white font-[500] bg-black rounded-3xl w-full"
            >
              Proceed
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Page;
