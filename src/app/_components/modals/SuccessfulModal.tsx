import React from 'react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import Button from '../button';
import successGif from '/public/images/success-gif.gif';
import Image from 'next/image';

type Props = {
  image?: string;
  title: string;
  text?: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function SuccessfulModal({ image, title, text, isOpen, onClose }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      onClose={onClose}
      classNames={{
        closeButton: '!m-0 top-5 right-5 bg-gray-200 text-black-800 rounded-lg *:size-4',
      }}
    >
      <ModalContent className="p-6 space-y-6 rounded-[40px] max-w-[342px]">
        {(onClose) => (
          <>
            <ModalHeader className="p-0">
              <Image
                src={image ?? successGif}
                alt="success"
                className="mx-auto"
                width={77}
                height={60}
              />
            </ModalHeader>
            <ModalBody className="space-y-6 p-0">
              <h1 className="font-medium text-xl text-black-800 text-center">{title}</h1>

              {text && <p className="text-base text-gray-300">{text}</p>}
            </ModalBody>
            <ModalFooter className="p-0">
              <Button
                onClick={onClose}
                className="!bg-lemonGreen-100 !text-lemonGreen-900"
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
