import Image from 'next/image';
import React from 'react';
import Successlogo from '/public/images/success-gif.gif';
import Button from '../../app/_components/button';

interface IProps {
  showModal: boolean;
  handleClose: () => void;
  text?: string;
  buttonText?: string;
  icon?: any;
  btnFunction?: () => void;
  title: string;
}

const SuccessModal: React.FC<IProps> = ({
  showModal,
  icon,
  handleClose,
  text,
  buttonText,
  btnFunction,
  title,
}) => {
  if (!showModal) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed bg-[#00000095] px-[24px] grid place-content-center h-[100vh] w-full z-[50] top-0 left-0"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-[342px] flex flex-col rounded-[40px] items-center text-center p-8 space-y-5"
      >
        <Image
          src={icon || Successlogo}
          alt="Success logo"
          className="size-[80px]"
          width={1000}
          height={1000}
        />
        <h1 className="font-medium text-xl text-black-800">{title}</h1>

        {text && <p className="text-base text-gray-300">{text}</p>}

        <Button
          onClick={() => {
            handleClose();
            btnFunction?.();
          }}
          className="bg-black-900 text-white"
        >
          {buttonText ? buttonText : 'Dismiss'}
        </Button>
      </div>
    </div>
  );
};

export default SuccessModal;
