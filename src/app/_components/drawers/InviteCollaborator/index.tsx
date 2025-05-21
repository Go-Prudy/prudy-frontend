import React from 'react';
import BottomDrawer from '../BottomDrawer';
import Button from '../../button';
import { motion } from 'framer-motion';
import Input from '../../input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { emailSchema } from '@/app/utils/validationSchema';
import useInviteCollaborator from './useInviteCollaborator';
import SuccessfulModal from '../../modals/SuccessfulModal';

type Props = {
  setShow: (i: boolean) => void;
  show: boolean;
  budgetId: string;
};
export default function InviteCollaboratorDrawer({ show, setShow, budgetId }: Props) {
  const {
    onSubmit,
    inviteCollaboratorMutation,
    invitedEmail,
    showSuccessfulModal,
    handleCloseSuccessfulModal,
  } = useInviteCollaborator({
    setShow,
    budgetId,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(emailSchema),
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[680px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        footer={
          <Button
            loading={inviteCollaboratorMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        }
        label="Invite collaborator to budget"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <form className="space-y-6" id="create-budget-form">
          <Input
            label="Email Address"
            inputName="email"
            type="text"
            placeholder="Enter email address"
            {...register('email')}
            error={errors?.email?.message}
          />
        </form>
      </BottomDrawer>
      <SuccessfulModal
        title={`Invite sent successfully to ${invitedEmail}`}
        isOpen={showSuccessfulModal}
        onClose={handleCloseSuccessfulModal}
      />
    </motion.div>
  );
}
