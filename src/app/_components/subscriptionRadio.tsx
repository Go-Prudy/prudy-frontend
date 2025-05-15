'use client';

import { useRadio, VisuallyHidden, cn } from '@nextui-org/react';

const SubscriptionRadio = (props: any) => {
  const {
    Component,
    children,
    isSelected,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getControlProps,
  } = useRadio(props);

  const {
    duration,
    header1,
    header2,
    header3,
    label,
    labelText,
    isDefaultSelected,
    isCurrentPlan,
  } = props;

  // Combine description and duration into a single node
  const combinedDescription = (
    <div className="flex gap-2 text-gray-600 items-center">
      <span className="text-base font-medium">{description}</span>
      {duration && <span className="text-xs">{duration}</span>}{' '}
      {/* Only render duration if it exists */}
    </div>
  );

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        'group flex flex-col p-4 rounded-lg border-1 transition-all',
        'w-full cursor-pointer flex-nowrap border border-default rounded-[20px] gap-4',
        isDefaultSelected || isSelected
          ? 'border-lemonGreen-600 bg-[#ECFDDC]'
          : 'bg-[#F7F7F9] border-[#EFEFF0]',
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>

      <div className=" flex w-full items-start ">
        <div className="flex flex-col w-full  ">
          <div className={`flex justify-between  `}>
            <div>
              <h1 className="text-lemonGreen-600 font-bold text-sm space-x-2">
                {header1}{' '}
                {isCurrentPlan && (
                  <span className="px-2 p-0.5 bg-white text-lemonGreen-600 text-[10px] rounded-xl font-normal">
                    Current Plan
                  </span>
                )}{' '}
                {label && (
                  <span
                    className={`px-2
                                 ${isDefaultSelected || isSelected ? 'text-white bg-lemonGreen-600 ' : 'text-black bg-white'}    py-0.5 text-[10px]  rounded-[12px] font-normal`}
                  >
                    {labelText}
                  </span>
                )}
              </h1>
              <h1 className="mt-2 flex items-start font-bold text-[24px] leading-[24px]">
                {header2}{' '}
                {header3 && (
                  <span className="text-xs font-normal text-gray-600 ml-2">
                    {header3}
                  </span>
                )}
              </h1>
            </div>
            <div {...getWrapperProps()}>
              <div {...getControlProps()} />
            </div>
          </div>
          <div>
            <div
              {...getLabelProps()}
              className="text-gray-600 mt-3 w-full bg-white rounded-b-[12px] text-xs py-3 px-1"
            >
              {children}
            </div>
            {combinedDescription} {/* Use the combined description node */}
          </div>
        </div>
      </div>
    </Component>
  );
};

export default SubscriptionRadio;
