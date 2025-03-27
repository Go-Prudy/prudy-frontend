import { forwardRef } from 'react';

type InputProps = {
  label: string;
  inputName: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  [key: string]: any;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, inputName, placeholder, required = false, disabled, ...rest }, ref) => {
    return (
      <div className="relative w-full mb-4">
        <label
          htmlFor={inputName}
          className="absolute top-4 left-4 text-xs text-[#828282]"
        >
          {label}
        </label>
        <input
          ref={ref}
          name={inputName}
          id={inputName}
          required={required}
          placeholder={placeholder}
          className={`bg-[#F7F7F9] border outline-[#66C227] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2 ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}`}
          disabled={disabled}
          {...rest}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
