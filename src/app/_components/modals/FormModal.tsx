import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import Button from '../button';

type Props = {
  title: string;
  text?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  onClick?: () => void;
};

export default function FormModal({
  title,
  text,
  isOpen,
  onClose,
  onClick,
  children,
}: Props) {
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
              <h1 className="font-medium text-xl text-black-800 text-center">{title}</h1>
            </ModalHeader>
            <ModalBody className="space-y-6 p-0">
              <div className="space-y-2">
                {text && <p className="text-base text-gray-300 text-center">{text}</p>}
                {children}
              </div>
            </ModalBody>
            <ModalFooter className="p-0">
              <Button onClick={onClick}>Save</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
