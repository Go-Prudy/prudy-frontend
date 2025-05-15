import React from 'react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import Button from '../button';
import Image, { StaticImageData } from 'next/image';
import cn from 'classnames';

type TrackPageModalProps = {
  image?: StaticImageData;
  title: string;
  text: string;
  isOpen: boolean;
  onClose: () => void;
  showFooter: boolean;
  onClick: () => void;
  footerButtonText: string;
  children?: React.ReactNode;
};

export default function TrackPageModal({
  image,
  title,
  text,
  isOpen,
  onClose,
  showFooter,
  onClick,
  footerButtonText,
  children,
}: TrackPageModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      onClose={onClose}
      classNames={{
        closeButton:
          '!m-0 !p-1 top-5 right-5 bg-gray-200 text-black-800 rounded-lg *:size-4',
      }}
    >
      <ModalContent className={cn('p-6 rounded-[40px] max-w-[342px]')}>
        {(onClose) => (
          <div className="space-y-6">
            {image && (
              <ModalHeader className="p-0">
                <Image src={image} alt="" className="mx-auto" width={77} height={60} />
              </ModalHeader>
            )}
            <ModalBody className="space-y-3 p-0">
              <h1 className="font-medium text-xl text-black-800">{title}</h1>

              <p className="text-base text-gray-300">{text}</p>
              {children}
            </ModalBody>
            {showFooter && (
              <ModalFooter className="p-0">
                <Button
                  onClick={onClick}
                  className="!bg-black-950 !text-white !rounded-[32px]"
                >
                  {footerButtonText}
                </Button>
              </ModalFooter>
            )}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
