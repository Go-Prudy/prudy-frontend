import Image from 'next/image';
import React from 'react';
import Successlogo from '@/images/success.gif';

interface IProps {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    handleAction?: () => void;
    handleClose: () => void;
    text: string;
    buttonText?: string;
    successIcon?: any
    btnFunction?: () => void;
    btnColor?: string;
}

const SuccessModal: React.FC<IProps> = ({
    showModal,
    successIcon,
    setShowModal,
    btnColor,
    handleAction,
    handleClose,
    text,
    buttonText,
    btnFunction
}) => {
    if (!showModal) return null;

    return (
        <div
            onClick={() => setShowModal(false)}
            className='fixed bg-[#00000095] px-[24px] grid place-content-center h-[100vh] w-full z-[50] top-0'
        >
            <div
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                className='bg-white w-[342px] flex flex-col rounded-[40px] items-center text-center p-8'
            >
                <Image src={successIcon ? successIcon : Successlogo} alt='Success logo' className={` ${successIcon ? 'size-[80px]' : 'size-[111.61px]'}`} width={1000} height={1000} />
                {successIcon &&
                    <h1 className=' font-[500] text-[20px] my-[19px] '>
                        Success 🎊
                    </h1>
                }
                <h1 className={`  ${successIcon ? 'text-[16px] font-[400]' : 'text-[20px] font-[500]'}`}  >{text}</h1>

                <div className='w-full flex gap-[16px] justify-between'>
                    <button
                        onClick={() => {
                            setShowModal(false);
                            handleClose();
                            btnFunction?.();
                        }}
                        className={`flex-1 mt-[19px]  rounded-[32px] py-[14px] text-center ${btnColor ? ` bg-[${btnColor}] text-white` : ' text-[#514F6E]  bg-[#EFF0F6]'}`}
                    >
                        {buttonText ? buttonText : 'Dismiss'}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
