import { useEffect, useState } from 'react';

export const useOtpTimer = (initialTime = 300) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!canResend && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft <= 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const startTimer = () => {
    setTimeLeft(initialTime);
    setCanResend(false);
  };

  return { timeLeft, canResend, startTimer };
};
