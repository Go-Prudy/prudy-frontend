import { SubmitHandler } from 'react-hook-form';

type Props = { setShow: (i: boolean) => void };

export default function useAddSubCategory({ setShow }: Props) {
  const onSubmit: SubmitHandler<{
    name: string;
  }> = async (data) => {
    console.log('log data', data);
    //   TODO: check is amount is less than or equal to amount Left in category
    setShow(false);
  };
  return { onSubmit };
}
