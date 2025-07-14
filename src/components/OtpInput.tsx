import React, { useRef } from 'react';

type OtpInputProps = {
  otpValues: string[];
  setOtpValues: React.Dispatch<React.SetStateAction<string[]>>;
  inputLength: number;
  focusedInput: number | null;
  setFocusedInput: React.Dispatch<React.SetStateAction<number | null>>;
  isPassword?: boolean;
};

export default function OtpInput({
  otpValues,
  setOtpValues,
  inputLength,
  focusedInput,
  setFocusedInput,
  isPassword = false,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown =
    (index: number): React.KeyboardEventHandler<HTMLInputElement> =>
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        return;
      }
      const validKeys = /^[0-9]{1}$|Backspace|Delete|Tab|Meta/;
      if (!validKeys.test(e.key)) {
        e.preventDefault();
        return;
      }

      if ((e.key === 'Backspace' || e.key === 'Delete') && index > 0) {
        setOtpValues((prev) => [...prev.slice(0, index), '', ...prev.slice(index + 1)]);
        setFocusedInput((prev) => (prev && prev > 0 ? prev - 1 : prev));
      }
    };

  const handleInput =
    (index: number): React.ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      const value = e.target.value;
      if (!/^\d*$/.test(value)) return; // Only allow numbers

      setOtpValues((prev) => [...prev.slice(0, index), value, ...prev.slice(index + 1)]);

      if (value && index < inputLength - 1) {
        setFocusedInput(index + 1);
      }
    };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pastedData) return;

    const newValues = [...otpValues];
    const pastedChars = pastedData.split('');

    let filledCount = 0;
    for (let i = index; i < inputLength && filledCount < pastedChars.length; i++) {
      newValues[i] = pastedChars[filledCount];
      filledCount++;
    }
    setOtpValues(newValues);

    const nextEmptyIndex = newValues.findIndex((val, idx) => idx > index && !val);
    setFocusedInput(nextEmptyIndex !== -1 ? nextEmptyIndex : inputLength - 1);
  };

  React.useEffect(() => {
    if (focusedInput !== null && inputsRef.current[focusedInput]) {
      inputsRef.current[focusedInput].focus();
    }
  }, [focusedInput]);

  return (
    <div className="flex items-center gap-2 justify-between">
      {Array.from({ length: inputLength }, (_, index) => {
        const isFilled = Boolean(otpValues[index]);

        return (
          <input
            key={index}
            className={`max-w-[50px] w-full h-12 sm:h-[56px] text-center font-extrabold text-slate-900 
          border border-[#EFEFF0] rounded-2xl p-2 outline-none 
          ${isFilled ? 'bg-[#E6F8EF]' : 'bg-[#F7F7F9]'} 
          ${isFilled ? 'text-black' : 'text-slate-900'} 
          focus:border-lemonGreen-600 focus:ring-2 focus:ring-indigo-100`}
            type={isPassword ? "password" : "text"}
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otpValues[index]}
            maxLength={1}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            onChange={handleInput(index)}
            onKeyDown={handleKeyDown(index)}
            onFocus={() => setFocusedInput(index)}
            onPaste={(e) => handlePaste(e, index)}
          />
        );
      })}
    </div>
  );
}
