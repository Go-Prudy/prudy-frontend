'use client';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import { BsArrowRight } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { signupSchema } from '@/utils/validationSchema';
import Header from '@/components/header';
import Input from '@/app/_components/input';
import Button from '@/app/_components/button';
import Checkbox from '@/components/checkbox';
import useSignup from './useSignup';

const Page = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
    resolver: yupResolver(signupSchema),
  });

  const {
    handleIsAgreedCheckbox,
    handleGoogle,
    onSubmit,
    isAgreed,
    validateEmailMutation,
    otpMutation,
  } = useSignup();

  return (
    <div>
      <Header link="/" title="Create account" />
      <div className="px-6 py-10">
        {/* <div className="w-full">
          <p className="mb-6 font-[500] text-[20px] leading-[28px] text-[#2D2D2D]">
            Sign up with...
          </p>
          <button
            onClick={() => handleGoogle()}
            className="w-full py-[16px] gap-[8px] rounded-[20px] text-[#575757] justify-center inline-flex flex-col items-center bg-[#F7F7F9] border border-[#EFEFF0]"
          >
            <GoogleLogo scale={24} />
            <p className='text-[12px] leading-[14.4px]'>Google</p>
          </button>
        </div>
        
        <div className='flex justify-between gap-[10px] my-[24px] items-center w-full'>
          <span className='flex-1 border border-[#E7E7EA]'></span>
          or
          <span className='flex-1 border border-[#E7E7EA]'></span>
        </div> */}

        {/* Add ref to the form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="First name"
            inputName="firstName"
            inputType="text"
            placeholder="Enter first name"
            {...register('firstName')}
          />

          <Input
            label="Last name"
            inputName="lastName"
            inputType="text"
            placeholder="Enter last name"
            {...register('lastName')}
          />

          <Input
            label="Email address"
            inputName="email"
            inputType="email"
            placeholder="example@email.com"
            {...register('email')}
          />

          <Input
            label="Phone number"
            inputName="phoneNumber"
            inputType="number"
            placeholder="0123456789"
            {...register('phoneNumber')}
          />

          <div className="flex gap-4">
            <Checkbox checked={isAgreed} onChange={handleIsAgreedCheckbox} required />

            <p>
              <span className="text-[14px] leading-[24px] text-[#575757]">
                I have read and agreed to {"Prudy's "}
              </span>
              <Link href="/terms&condition" className="text-[14px] text-lemonGreen-600">
                Indemnity, Terms & Privacy Policy.
              </Link>
            </p>
          </div>
          <p className="flex font-medium justify-center gap-2">
            <span className="text-[#575757]">Already have an account? </span>{' '}
            <Link href="/login" className="text-lemonGreen-600">
              Sign in
            </Link>
          </p>
          <Button
            // also disable if there are errors too
            disabled={!isAgreed}
            loading={validateEmailMutation.isPending || otpMutation.isPending}
            type="submit"
          >
            <span>Proceed</span>
            <BsArrowRight className="size-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
export default Page;
