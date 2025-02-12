import React from 'react';

type OtpInputProps = {
  index: number;
  otpValues: string[];
  setOtpValues: React.Dispatch<React.SetStateAction<string[]>>;
  inputLength: number;
  focusedInput: number | null;
  setFocusedInput: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function OtpInput({
  index,
  otpValues,
  setOtpValues,
  inputLength,
  focusedInput,
  setFocusedInput,
}: OtpInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const validKeys = /^[0-9]{1}$|Backspace|Delete|Tab|Meta/;
    if (!validKeys.test(e.key)) {
      e.preventDefault();
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (index > 0) {
        setOtpValues((prev) => [...prev.slice(0, index), '', ...prev.slice(index + 1)]);
        setFocusedInput((prev) => (prev && prev > 0 ? prev - 1 : prev));
      }
    }
  };

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setOtpValues((prev) => [...prev.slice(0, index), value, ...prev.slice(index + 1)]);

    if (value && index < inputLength - 1) {
      setFocusedInput(index + 1);
    }
  };

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    e.target.select();
  };

  const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(text)) {
      const digits = text.split('');
      setOtpValues((prev) => [
        ...prev.slice(0, index),
        digits[index],
        ...prev.slice(index + 1),
      ]);
    }
  };

  React.useEffect(() => {
    if (focusedInput === index && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusedInput, index]);

  React.useEffect(() => {
    if (otpValues[index] && inputRef.current) {
      inputRef.current.value = otpValues[index];
    }
  }, [otpValues, index]);

  const isFilled = !!otpValues[index];

  return (
    <input
      type="text"
      autoComplete="new-password"
      className={`w-12 h-[56px] text-center font-extrabold text-slate-900 border border-[#EFEFF0] rounded-2xl p-2 outline-none 
         ${isFilled ? 'bg-[#E6F8EF] text-slate-900' : 'bg-[#F7F7F9]'} 
         ${isFilled ? 'text-black' : 'text-slate-900'} 
         focus:border-lemonGreen-700 focus:ring-2 focus:ring-indigo-100`}
      pattern="\d*"
      maxLength={1}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onPaste={handlePaste}
      ref={inputRef}
      value={otpValues[index]}
    />
  );
}
