import { StaticImageData } from 'next/image';
import { ReactNode } from 'react';
import Image from 'next/image';
import { CircularProgress } from '@nextui-org/react';

type Props = {
  image: StaticImageData;
  title: string;
  description?: string;
  buttonText?: string;
  onClick?: () => void;
  icon?: ReactNode;
  isLoading?: boolean;
};

export default function EmptyState({ image, title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-[250px] gap-4">
      <Image src={image} width={67} height={67} alt="" />

      <div className="space-y-2 text-center">
        <p className="font-medium text-gray-600">{title}</p>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
    </div>
  );
}

export const EmptyStateDarkBg = ({
  image,
  title,
  description,
  buttonText,
  onClick,
  icon,
  isLoading,
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-[250px] gap-3 bg-gray-100 rounded-3xl">
      <Image src={image} width={75} height={75} alt="" />

      <div className="space-y-2 text-center">
        <p className="font-medium text-black-800 max-w-[260px]">{title}</p>
        {description && <p className="text-sm text-gray-400">{description}</p>}
        {buttonText && (
          <button
            onClick={onClick}
            className="px-3 py-1.5 bg-lemonGreen-600 rounded-xl flex items-center gap-2 text-white text-xs font-medium"
          >
            {isLoading ? (
              <CircularProgress size="sm" />
            ) : (
              <>
                {icon && icon}
                {buttonText}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
