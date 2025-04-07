import { forwardRef } from 'react';
import cn from 'classnames';

type InputProps = {
  label: string;
  inputName: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  [key: string]: any;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, inputName, placeholder, required = false, disabled, error, ...rest },
    ref,
  ) => {
    return (
      <div className="relative w-full">
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
            'bg-gray-100 text-gray-600 border outline-lemonGreen-600 h-20 w-full px-4 rounded-[20px] pt-5 pb-2',
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
