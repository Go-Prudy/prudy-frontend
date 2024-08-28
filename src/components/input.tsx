'use client'
import React, { useState } from 'react';

type InputProps = {
  label: string;
  inputName: string;
  inputType: string;
  placeholder: string;
  onChange: (value: string) => void; // Callback to handle changes in the parent component
  required?: boolean;
};

const Input = ({ label, inputName, inputType, placeholder, onChange, required = true }: InputProps) => {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue); // Pass the new value to the parent component
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
        value={value}
        required={required}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-[#F7F7F9] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2"
      />
    </div>
  );
};

export default Input;
