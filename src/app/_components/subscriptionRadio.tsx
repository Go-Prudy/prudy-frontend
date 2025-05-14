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
    <div className="flex gap-[8px] text-[#575757] items-center">
      <span className="text-[16px] font-[500]">{description}</span>
      {duration && <span className="text-[12px]">{duration}</span>}{' '}
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
              <h1 className="text-lemonGreen-600 font-[700] text-[14px] space-x-2">
                {header1}{' '}
                {isCurrentPlan && (
                  <span className="px-2 p-0.5 bg-white text-lemonGreen-600 text-[10px] rounded-xl font-normal">
                    Current Plan
                  </span>
                )}{' '}
                {label && (
                  <span
                    className={`px-[8px]
                                 ${isDefaultSelected || isSelected ? 'text-[#ffffff] bg-lemonGreen-600 ' : 'text-black bg-white'}    py-[2px] text-[10px]  rounded-[12px] font-[400]`}
                  >
                    {labelText}
                  </span>
                )}
              </h1>
              <h1 className="mt-[8px] flex items-start font-[700] text-[24px] leading-[24px]">
                {header2}{' '}
                {header3 && (
                  <span className=" text-[12px] font-[400] text-[#575757] ml-[8px]">
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
              className="text-[#575757] mt-[12px] w-full bg-[#FFFFFF] rounded-b-[12px] text-[12px] py-[12px]   px-[4px] "
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
