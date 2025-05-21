import React from 'react';

type Props = { children: React.ReactNode };

export default function BottomButton({ children }: Props) {
  return (
    <div className="fixed max-w-[680px] bottom-0 left-0 right-0 mx-auto z-20 bg-white shadow-[0px_-20px_56px_0px_#514F6E1A] p-6 flex gap-4">
      {children}
    </div>
  );
}
