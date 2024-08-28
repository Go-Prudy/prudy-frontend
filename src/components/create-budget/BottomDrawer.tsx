import { useRouter } from 'next/navigation';
import React from 'react'
import { BsChevronLeft, BsX } from 'react-icons/bs';
import { motion } from 'framer-motion';
interface IProps {
    label: string;
    back: boolean;
    close: boolean;
    link?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    onClose: () => void;
    show: boolean;
}


const BottomDrawer: React.FC<IProps> = ({ label, link, back, close, children, footer, onClose, show }) => {
    const navigate = useRouter();

    if (!show) return null; // Render nothing if 'show' is false

    return (

        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}

            className="bottom-drawer  z-[30] absolute bottom-0 w-full bg-[rgb(255,255,255)] rounded-t-[24px]">
            <div className="header bg-[#F7F7F9] p-[16px] rounded-t-[24px] flex justify-between items-center">
                <button
                    onClick={() => back && link && navigate.push(link)}
                    className={`grid place-content-center size-[36px] bg-white rounded-full text-[18px] text-[#828282] ${back ? 'opacity-100' : 'opacity-0'}`}
                >
                    <BsChevronLeft size={20} />
                </button>

                <h1 className="leading-[21.6px] font-[500] text-[18px] text-center">{label}</h1>

                {close && (
                    <button onClick={onClose} className="close-button text-[18px] grid place-content-center size-[36px] text-[#828282] bg-white rounded-full">
                        <BsX size={25} />
                    </button>
                )}
            </div>
            <div className="content py-[24px] px-[24px]">
                {children}
            </div>
            <div className="p-[24px] w-full border-t-[2px] border-t-[#EFF0F6]">
                {footer && <div className="w-full">{footer}</div>}
            </div>
        </motion.div>
    );
};

export default BottomDrawer;