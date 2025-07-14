import { useRouter } from 'next/navigation';
import React, { Fragment } from 'react';
import { BsChevronLeft, BsX } from 'react-icons/bs';
import { motion } from 'framer-motion';
import cn from 'classnames';

interface IProps {
  label: string;
  back: boolean;
  close: boolean;
  link?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  show: boolean;
  className?: string;
  headerClass?: string;
}

const FullPageDrawer: React.FC<IProps> = ({
  label,
  link,
  back,
  close,
  children,
  footer,
  onClose,
  show,
  className,
  headerClass,
}) => {
  const navigate = useRouter();

  if (!show) return null; // Render nothing if 'show' is false

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'max-w-[680px] w-full h-full z-[60] absolute top-0 bg-white rounded-t-3xl',
        className,
      )}
    >
      <div
        className={`bg-gray-100 px-6 py-4 rounded-t-3xl flex justify-between items-center ${headerClass}`}
      >
        {(back || link) && (
          <button
            onClick={() => (link ? navigate.push(link) : onClose())}
            className={`flex justify-center items-center size-9 bg-gray-100 rounded-full text-gray-400 ${back ? 'opacity-100' : 'opacity-0'}`}
          >
            <BsChevronLeft size={20} />
          </button>
        )}

        <div className="w-full flex justify-between items-center">
          <h1 className="font-medium text-lg mx-auto">{label}</h1>

          {close && (
            <button
              onClick={onClose}
              className="text-lg flex justify-center items-center size-9 text-gray-400 bg-gray-100 rounded-full"
            >
              <BsX size={25} />
            </button>
          )}
        </div>
      </div>
      <div className="px-6 pt-6 space-y-6 h-[85%] flex flex-col justify-between">
        <div className=" min-h-[calc(100vh-218px)] overflow-auto">{children}</div>

        {footer && (
          <div className="p-6 w-full border-t border-gray-200 rounded-t-3xl bg-white shadow-[0px_-5px_4px_0px_#EFF0F64D]">
            <div className="w-full">{footer}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FullPageDrawer;
