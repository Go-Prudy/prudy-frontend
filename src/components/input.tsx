'use client'
import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Import eye icons

type InputProps = {
  label: string;
  inputName: string;
  inputType: string;
  placeholder: string;
  onChange: (value: string) => void;
  value?: string;
  required?: boolean;
  min?: string;
  maxLength?: number;
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
  maxLength,
  disabled,
}: InputProps) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const renderInputType = () => {
    switch (inputType) {
      case 'password':
        return (
          <div className="relative w-full mb-4">
            <label htmlFor={inputName} className="absolute top-4 left-4 text-xs text-[#828282]">
              {label}
            </label>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between text and password
              name={inputName}
              id={inputName}
              value={inputValue}
              required={required}
              min={min}
              maxLength={maxLength}
              onChange={handleChange}
              placeholder={placeholder}
              className={`bg-[#F7F7F9] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2 ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}`}
              disabled={disabled}
            />
            {/* Eye icon for showing/hiding password */}
            <div
              className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
              onClick={toggleShowPassword}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
        );
      default:
        return (
          <div className="relative w-full mb-4">
            <label htmlFor={inputName} className="absolute top-4 left-4 text-xs text-[#828282]">
              {label}
            </label>
            <input
              type={inputType}
              name={inputName}
              id={inputName}
              value={inputValue}
              required={required}
              min={min}
              maxLength={maxLength}
              onChange={handleChange}
              placeholder={placeholder}
              className={`bg-[#F7F7F9] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2 ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}`}
              disabled={disabled}
            />
          </div>
        );
    }
  };

  return renderInputType();
};

export default Input;
