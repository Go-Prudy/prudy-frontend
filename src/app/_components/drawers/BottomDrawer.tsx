import { useRouter } from 'next/navigation';
import React from 'react';
import { BsChevronLeft, BsX } from 'react-icons/bs';
import { motion } from 'framer-motion';
import cn from 'classnames';

interface IProps {
  label: string;
  padding?: number;
  back: boolean;
  close: boolean;
  link?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  show: boolean;
  removePadding?: boolean;
  className?: string;
}

const BottomDrawer: React.FC<IProps> = ({
  label,
  padding,
  link,
  back,
  close,
  children,
  footer,
  onClose,
  removePadding,
  show,
  className,
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
        'max-w-[500px] w-full z-[60] absolute bottom-0 bg-white rounded-t-3xl',
        className,
      )}
    >
      <div
        className={`bg-gray-100 px-6 py-4 rounded-t-3xl flex justify-between items-center`}
      >
        {back && link && (
          <button
            onClick={() => navigate.push(link)}
            className={`flex justify-center items-center size-9 bg-white rounded-full text-gray-400 ${back ? 'opacity-100' : 'opacity-0'}`}
          >
            <BsChevronLeft size={20} />
          </button>
        )}

        <div className="w-full flex justify-between items-center">
          <h1 className="font-medium text-lg">{label}</h1>

          {close && (
            <button
              onClick={onClose}
              className="text-lg flex justify-center items-center size-9 text-gray-400 bg-white rounded-full"
            >
              <BsX size={25} />
            </button>
          )}
        </div>
      </div>
      <div className="p-6 max-h-[450px] overflow-auto">{children}</div>

      {footer && (
        <div className="p-6 w-full border-t border-gray-200 rounded-t-3xl bg-white shadow-[0px_-5px_4px_0px_#EFF0F64D]">
          <div className="w-full">{footer}</div>
        </div>
      )}
    </motion.div>
  );
};

export default BottomDrawer;
