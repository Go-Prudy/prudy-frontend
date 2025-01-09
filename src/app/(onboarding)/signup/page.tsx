'use client'
import Header from '@/components/header';
import GoogleLogo from '@/icons/google-logo';
import Link from 'next/link';
import Input from '@/components/input';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { useAuthentication } from '@/app/store/AuthStore';
import api from '../../../utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { getGoogleUrl, sendOtp, signupUser, signUpWithGoogle } from '@/app/services/AuthenticationService';
import { IOtpResponse } from '@/app/Types';

const Page = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const { signup } = useAuthentication();
  const [loading, setIsLoading] = useState(false);
  const navigate = useRouter()
  // Create a ref for the form
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    setChecked(!checked);
  };

  // React Query mutation for sending OTP
  const otpMutation = useMutation<IOtpResponse, Error, { email: string; phoneNumber: string }>({
    mutationFn: (otpFormData) => sendOtp(otpFormData),
    onSuccess: (data: IOtpResponse) => {
      if (data?.success) {
        const reference = data.data.reference;
        const formDataWithReference = {
          firstName,
          lastName,
          email,
          phoneNumber,
          registeredWith: reference,
        };

        // console.log(formDataWithReference);
      }
    },
    onError: (error: Error) => {
      console.error('Error sending OTP:', error);
    },
  });



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic
    const otpFormData = {
      email,
      phoneNumber,
      type: "signup",
      channel: "email",
    };

    const formData = {
      firstName,
      lastName,
      email,
      phoneNumber,
    };

    try {
      setIsLoading(true)
      const otpResponse = await otpMutation.mutateAsync(otpFormData);
      // console.log(otpResponse);
      if (otpResponse?.success) {
        const reference = otpResponse.data.reference;
        const newFormData = { ...formData, registeredWith: 'form', otpReference: reference }
        // Store form data using Zustand store
        signup(newFormData);
        navigate.push('/signup/verify')
      }

    } catch (error) {
      setIsLoading(false)
      console.error('Error during sign-up:', error);
    } finally {
      setIsLoading(false);
    }
    // console.log({ firstName, lastName, email, phoneNumber, checked });
    signup(formData);
  };



  const handleProceedClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit(); // Trigger form submission
    }
  };

  const handleGoogle = async () => {
    try {
      setIsLoading(true)
      window.location.href = getGoogleUrl();
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[500px] min-h-[100vh] ">
      <Header link={'/'} title="Create account" />
      <div className="px-6 py-10">
        <div className="w-full">
          <p className="mb-6 font-[500] text-[20px] leading-[28px] text-[#2D2D2D]">Sign up with...</p>
          <button onClick={() => handleGoogle()} className="w-full py-[16px] gap-[8px] rounded-[20px] text-[#575757] justify-center inline-flex flex-col items-center bg-[#F7F7F9] border border-[#EFEFF0]">
            <GoogleLogo scale={24} />
            <p className='text-[12px] leading-[14.4px]'>Google</p>
          </button>
        </div>

        <div className='flex justify-between gap-[10px] my-[24px] items-center w-full'>
          <span className='flex-1 border border-[#E7E7EA]'></span>
          or
          <span className='flex-1 border border-[#E7E7EA]'></span>
        </div>

        {/* Add ref to the form */}
        <form onSubmit={handleSubmit} ref={formRef}>
          <Input label="First name" inputName="firstName" inputType="text" placeholder="Enter first name" onChange={(value) => setFirstName(value)} />

          <Input label="Last name" inputName="lastName" inputType="text" placeholder="Enter last name" onChange={(value) => setLastName(value)} />

          <Input label="Email address" inputName="email" inputType="email" placeholder="example@email.com" onChange={(value) => setEmail(value)} />

          <Input label="Phone number" inputName="phoneNumber" inputType="number" placeholder="0123456789" onChange={(value) => setPhoneNumber(value)} />

          <div className="flex gap-4 mb-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                required
                onChange={handleChange}
              />
              <div
                className={`w-6 h-6 flex items-center justify-center border-2 rounded ${checked ? 'bg-[#66C227] border-[#66C227]' : 'bg-white border-gray-300'
                  }`}
              >
                {checked && (
                  <svg
                    className="w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
            </label>

            <p>
              <span className="text-[14px] leading-[24px] text-[#575757]">I have read and agreed to Prudy’s </span>
              <Link href="/terms&condition" className="text-[14px] text-lemonGreen-700">
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
        </form>
      </div>
      <div className="sticky bottom-0 flex w-full items-center bg-white px-6 py-6 rounded-t-3xl" style={{ boxShadow: '0px -4px 4px 0px #EFF0F680' }}>
        <button type='button' className="h-12 flex font-[500] gap-[8px] items-center justify-center  text-white bg-black rounded-3xl w-full" onClick={handleProceedClick}>
          {loading ? <div className='h-12 flex font-[500] gap-[8px] items-center justify-center  text-white bg-black rounded-3xl w-full '>
            Proceeding...

          </div> :
            'Proceed'

          }
          {!loading && <BsArrowRight className='size-[20px] ' />}
        </button>
      </div>
    </motion.div>
  );
};

export default Page;
