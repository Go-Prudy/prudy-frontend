import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react';
import loadingGif from '/public/images/loading.gif';
import Image from 'next/image';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  text?: string;
};

export default function LoadingModal({ isOpen, onClose, text }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      onClose={onClose}
      classNames={{
        closeButton: 'hidden',
      }}
    >
      <ModalContent className="p-6 rounded-[40px] max-w-[152px]">
        {(onClose) => (
          <>
            <ModalHeader className="p-0">
              <Image
                src={loadingGif}
                alt="loading"
                className="mx-auto"
                width={100}
                height={100}
              />
            </ModalHeader>
            <ModalBody className="p-0">
              <p className="text-center">{text || 'Creating...'}</p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
