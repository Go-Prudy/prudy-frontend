import Header from '@/components/header';
import Input from '@/components/input';
import React from 'react';

const ChangePasscodePage = () => {
  return (
    <div className="w-full">
      <Header title="Reset passcode" />
      <div className="px-6 py-10">
        <div className="w-full mb-6">
          <p className="mb-6">Reset passcode</p>   
        </div>
        <Input label="Passcode" inputName="newPasscode" inputType="number" placeholder="Enter new passcode" />
        <Input label="Confirm passcode" inputName="confirmPasscode" inputType="number" placeholder="Confirm new passcode" />

      </div>
      <div className="sticky bottom-0 flex w-full items-center bg-white px-6 py-6 rounded-t-3xl shadow-[0_-4px_4px_0_#EFF0F650]">
        <button className="h-12 text-white bg-black rounded-3xl w-full">Reset</button>
      </div>
    </div>
  );
};

export default ChangePasscodePage;
