'use client'
import React, { useState, useEffect } from 'react';

type InputProps = {
  label: string;
  inputName: string;
  inputType: string;
  placeholder: string;
  onChange: (value: string) => void;
  value?: string; // Accept a value prop for controlled components
  required?: boolean;
  min?: string;
  disabled?: boolean;
};

const Input = ({
  label,
  inputName,
  inputType,
  placeholder,
  onChange,
  value = '',
  required = true,
  min,
  disabled,
}: InputProps) => {
  const [inputValue, setInputValue] = useState<string>(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]); // Update the input value when the prop changes

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="relative w-full mb-4">
      <label htmlFor={inputName} className="absolute top-4 left-4 text-xs text-[#828282]">
        {label}
      </label>
      <input
        type={inputType}
        name={inputName}
        id={inputName}
        value={inputValue} // Use inputValue from state
        required={required}
        min={min}
        onChange={handleChange}
        placeholder={placeholder}
        className={`bg-[#F7F7F9] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2 ${disabled ? 'cursor-not-allowed bg-gray-200' : ''
          }`}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;
