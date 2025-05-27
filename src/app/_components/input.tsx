import { forwardRef } from 'react';
import cn from 'classnames';

type InputProps = {
  label: string;
  inputName: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  [key: string]: any;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      inputName,
      placeholder,
      className,
      required = false,
      disabled,
      error,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className={cn('relative w-full', className)}>
        <label
          htmlFor={inputName}
          className="absolute top-4 left-4 text-xs text-gray-500"
        >
          {label}
        </label>
        <input
          ref={ref}
          name={inputName}
          id={inputName}
          required={required}
          placeholder={placeholder}
          className={cn(
            'bg-gray-100 text-gray-600 text-sm sm:text-base border outline-lemonGreen-600 h-[73px] w-full px-4 rounded-[20px] pt-5 pb-0',
            disabled ? 'cursor-not-allowed bg-gray-200' : '',
          )}
          disabled={disabled}
          {...rest}
        />
        {error && <p className="text-xs text-red-500 mt-1 capitalize">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
