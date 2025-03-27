import React from 'react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}
const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-white"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const Checkbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  required = false,
}) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      required={required}
      onChange={onChange}
    />
    <div
      className={`w-6 h-6 flex items-center justify-center border-2 rounded ${
        checked ? 'bg-[#66C227] border-[#66C227]' : 'bg-white border-gray-300'
      }`}
    >
      {checked && <CheckIcon />}
    </div>
  </label>
);

export default Checkbox;
