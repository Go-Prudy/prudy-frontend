'use client';
import Header from '@/components/header';
import React from 'react';

const VerifyOtpPage = () => {
  const inputLength = 6;
  const [otpValues, setOtpValues] = React.useState<number[]>([]);
  const [focusedInput, setFocusedInput] = React.useState<null | number>(null);

  return (
    <div className="w-full">
      <Header title="Create account" />
      <form id="otp-form" className="pt-10 px-6">
        <p className="font-medium text-[#2D2D2D] text-xl mb-6">Verify your email address/phone number</p>
        <div className="flex items-center gap-2 mb-6 justify-between">
          {Array.from(Array(inputLength).keys()).map((el) => (
            <OtpInput
              key={el}
              index={el}
              otpValues={otpValues}
              setOtpValues={setOtpValues}
              inputLength={inputLength}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
            />
          ))}
        </div>
        <div className="sticky bottom-0 flex w-full items-center bg-white mb-3">
          <button type="submit" className="h-12 text-white bg-black rounded-3xl w-full">
            Verify
          </button>
        </div>
        <button className="font-medium text-lemonGreen-700">Resend code</button>
      </form>
    </div>
  );
};

type OtpInputProps = {
  index: number;
  value: number;
  setOtpValues: React.Dispatch<React.SetStateAction<string[]>>;
  inputLength: number;
  focusedInput: number | null;
  setFocusedInput: React.Dispatch<React.SetStateAction<number | null>>;
};

const OtpInput = ({ index, inputLength, otpValues, setOtpValues, focusedInput, setFocusedInput }: OtpInputProps) => {
  const inputRef = React.useRef(null);

  const handleKeyDown = (e) => {
    if (!/^[0-9]{1}$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && !e.metaKey) {
      e.preventDefault();
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (index > 0) {
        const { target } = e;
        (target as HTMLInputElement).value = '';
        setFocusedInput((prev) => {
          if (prev != null && prev > 0) {
            return prev - 1;
          }
          return prev;
        });
      }
    }
  };

  const handleInput = (e: React.SyntheticEvent) => {
    const { target } = e;
    setOtpValues((prev) => [
      ...prev.slice(0, index),
      (target as HTMLInputElement).value,
      ...prev.slice(index + 1, prev.length),
    ]);
    if ((target as HTMLInputElement)?.value) {
      if (index < inputLength - 1) {
        setFocusedInput(index + 1);
      }
    }
  };

  const handleFocus = (e: React.SyntheticEvent) => {
    const { target } = e;
    (target as HTMLInputElement).select();
  };

  const handlePaste = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const text = (e as React.ClipboardEvent<HTMLInputElement>).clipboardData.getData('text');
    if (!new RegExp(`^[0-9]{${inputLength}}$`).test(text)) {
      return;
    }
    let digits: any[] = text.split('');
    // digits = digits.map((item) => parseInt(item));
    (e.target as HTMLInputElement).value = digits[index];
  };

  React.useEffect(() => {
    if (focusedInput === index && inputRef?.current) {
        (inputRef.current as HTMLInputElement).focus();
    }
  }, [index, focusedInput]);

  React.useEffect(() => {
    if (otpValues.length > 0 && inputRef?.current) {
        (inputRef.current as HTMLInputElement).value = otpValues[index]
    }
  }, [index, otpValues]);
  return (
    <input
      type="text"
      autoComplete="new-password"
      className="w-12 h-[56px] text-center font-extrabold text-slate-900 empty:bg-[#F7F7F9] border border-[#EFEFF0] hover:border-slate-200 valid:bg-lemonGreen-700 appearance-none rounded-2xl p-2 outline-none focus:bg-white focus:border-lemonGreen-700 focus:ring-2 focus:ring-indigo-100"
      pattern="\d*"
      maxLength={1}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onPaste={handlePaste}
      ref={inputRef}
    />
  );
};

export default VerifyOtpPage;
