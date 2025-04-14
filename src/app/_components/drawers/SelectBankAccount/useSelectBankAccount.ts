import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

export default function useSelectBankAccount({
  setShow,
}: {
  setShow: (i: boolean) => void;
}) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>();

  const onSubmit: SubmitHandler<{
    account: string;
  }> = async (data) => {
    console.log('log data', data);

    // navigate to transations page with selectedAccountId
    setShow(false);
  };
  return { onSubmit, selectedAccountId, setSelectedAccountId };
}
