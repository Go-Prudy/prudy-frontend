import React from 'react';
import BottomDrawer from '../BottomDrawer';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import { BsArrowRight } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { signupSchema } from '@/app/utils/validationSchema';
import Input from '@/app/_components/input';
import Button from '@/app/_components/button';
import Checkbox from '@/app/_components/checkbox';
import useSignup from './useSignup';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
}

export default function SignupDrawer({
  show,

  setShow,
}: Props) {
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
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[500px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        label="Create your Account"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
        className="max-h-[70vh] overflow-auto"
      >
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
              <span className="text-sm text-gray-600">
                I have read and agreed to {"Prudy's "}
              </span>
              <Link href="/terms&condition" className="text-[14px] text-lemonGreen-600">
                Indemnity, Terms & Privacy Policy.
              </Link>
            </p>
          </div>
          <p className="flex font-medium justify-center gap-2">
            <span className="text-gray-600">Already have an account? </span>{' '}
            <Link
              onClick={() => setShow(false)}
              href="/login"
              className="text-lemonGreen-600"
            >
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
      </BottomDrawer>
    </motion.div>
  );
}
