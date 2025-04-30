import { useEffect, useRef, useState } from 'react';
import { BsChevronDoubleUp } from 'react-icons/bs';
import avatarGroupImage from '/public/images/avatar/important-note.png';
import Image from 'next/image';
import cn from 'classnames';

export function ImportantNote() {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isOpen]);

  return (
    <div className="rounded-t-[20px] bg-lemonGreen-800 px-3 py-2 text-white w-[calc(100%-24px)] mx-auto space-y-3">
      <button
        onClick={toggleOpen}
        className="flex w-full justify-between items-center focus:outline-none"
      >
        <span className="text-sm font-bold">Important Note</span>
        <div className="w-6 h-6 rounded-full bg-[#FFFFFF1A] flex items-center justify-center">
          <BsChevronDoubleUp
            className={`transform transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            size={12}
          />
        </div>
      </button>

      <div
        ref={contentRef}
        className={cn(
          'text-sm space-y-3 transition-all duration-500 ease',
          isOpen ? 'max-h-auto' : 'max-h-0 !m-0 !-mb-2 overflow-hidden',
        )}
      >
        <p>
          Kindly note that GoPrudy does not have access to view your password or withdraw
          from your account. Your transaction details are encrypted and visible to you
          alone.
        </p>

        <div className="flex items-center gap-2">
          <Image src={avatarGroupImage} alt="" width={52} height={28} />

          <span>60+ accounts linked</span>
        </div>
      </div>
    </div>
  );
}
