import { useRadio, VisuallyHidden, cn } from '@nextui-org/react';

const CustomRadio = (props: any) => {
  const {
    Component,
    children,
    isSelected,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        'relative group inline-flex flex-1 hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent',
        'w-full cursor-pointer border-1 border-default rounded-[20px] gap-4 p-4 mb-2',
        'data-[selected=true]:border-lemonGreen-600 bg-gray-100  data-[selected=true]:bg-lemonGreen-50',
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span
        {...getWrapperProps()}
        className={cn(
          'absolute top-3 right-3 w-5 h-5 bg-white border border-gray-200 rounded-full',
          'group-data-[selected=true]:border-lemonGreen-600',
        )}
      >
        <span {...getControlProps()} />
      </span>
      <div className="w-full space-y-4 !gap-0">
        {children && <div className="text-sm font-medium text-black-800">{children}</div>}
      </div>
    </Component>
  );
};
export default CustomRadio;
