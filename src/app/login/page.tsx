import Header from '@/components/header';
import GoogleLogo from '@/icons/google-logo';
import Link from 'next/link';
import Input from '@/components/input';
import React from 'react';

const LoginPage = () => {
  return (
    <div className="w-full">
      <Header title="Create account" />
      <div className="px-6 py-10">
        <div className="w-full mb-6">
          <p className="mb-6">Sign in to your account</p>
          <button className="h-20 w-full rounded-[20px] text-[#575757] justify-center inline-flex flex-col items-center bg-[#F7F7F9] border border-[#EFEFF0]">
            <GoogleLogo />
            <p>Google</p>
          </button>
        </div>
        <Input label="Email address" inputName="email" inputType="email" placeholder="example@email.com" />
        <Input label="Passcode" inputName="passcode" inputType="number" placeholder="Enter your passcode" />
        <p className="flex font-medium justify-end gap-2">
          <Link href="/login" className="text-[#575757]">
            Forgot passcode?
          </Link>
        </p>
      </div>
      <div className="sticky bottom-0 flex w-full items-center bg-white px-6 py-6 rounded-t-3xl shadow-[0_-4px_4px_0_#EFF0F650]">
        <button className="h-12 text-white bg-black rounded-3xl w-full">Sign in</button>
      </div>
    </div>
  );
};

export default LoginPage;
