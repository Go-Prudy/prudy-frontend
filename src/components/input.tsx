import React from 'react';


type InputProps = {
    label: string;
    inputName: string;
    inputType: string;
    placeholder: string;
};
const Input = ({ label, inputName, inputType, placeholder }: InputProps) => {
  return (
    <div className="relative w-full mb-4">
      <label htmlFor={inputName} className="absolute top-4 left-4 text-xs text-[#828282]">
        {label}
      </label>
      <input
        type={inputType}
        name={inputName}
        id={inputName}
        placeholder={placeholder}
        className="bg-[#F7F7F9] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2"
      />
    </div>
  );
};

export default Input;
