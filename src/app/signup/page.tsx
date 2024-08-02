import Header from '@/components/header';
import ForwardArrow from '@/icons/forward-arrow';
import GoogleLogo from '@/icons/google-logo';
import Link from 'next/link';
import Input from '@/components/input';
import React from 'react';

const page = () => {
  return (
    <div className="w-full">
      <Header title="Create account" />
      <div className="px-6 py-10">
        <div className="w-full mb-6">
          <p className="mb-6">Sign up with...</p>
          <button className="h-20 w-full rounded-[20px] text-[#575757] justify-center inline-flex flex-col items-center bg-[#F7F7F9] border border-[#EFEFF0]">
            <GoogleLogo />
            <p>Google</p>
          </button>
        </div>
        <Input label="First name" inputName="firstName" inputType="text" placeholder="Enter first name" />
        <Input label="Last name" inputName="lastName" inputType="text" placeholder="Enter last name" />
        <Input label="Email address" inputName="email" inputType="email" placeholder="example@email.com" />
        <Input label="Phone number" inputName="phoneNumber" inputType="number" placeholder="0123456789" />
        <div className="flex gap-4 mb-6">
          <input type="checkbox" name="tos" id="tos" />
          <p>
            <span className="text-[#575757]">I have read and agreed to Prudy’s </span>
            <Link href="#" className="text-lemonGreen-700">
              Indemnity, Terms & Privacy Policy.
            </Link>
          </p>
        </div>
        <p className="flex font-medium justify-center gap-2">
          <span className="text-[#575757]">Already have an account? </span>{' '}
          <Link href="/login" className="text-lemonGreen-700">
            Login
          </Link>
        </p>
      </div>
      <div className="sticky bottom-0 flex w-full items-center bg-white px-6 py-6 rounded-t-3xl shadow-[0_-4px_4px_0_#EFF0F650]">
        <button className="h-12 text-white bg-black rounded-3xl w-full">Proceed</button>
      </div>
    </div>
  );
};

export default page;
