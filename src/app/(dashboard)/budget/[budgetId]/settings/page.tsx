'use client';
import Header from '@/components/header';
import { Icons } from '@/app/icons';
import InviteCollaboratorDrawer from '@/app/_components/drawers/InviteCollaborator';
import { useState } from 'react';
import SuccessfulModal from '@/app/_components/modals/SuccessfulModal';
import DeleteBudgetModal from '@/app/_components/modals/DeleteBudget';
import { useRouter } from 'next/navigation';

const actions = [
  {
    title: 'Invite a Collaborator',
    icon: Icons.addUser,
    descripttion: 'Team up with your loved ones. Manage money together, effortlessly!',
    action: 'invite',
  },
  {
    title: 'Duplicate Budget',
    icon: Icons.note,
    descripttion:
      'Don’t stress on adding all your budget categories afresh. Re-use this budget details.',
    action: 'duplicate',
  },
  {
    title: 'Delete Budget',
    icon: Icons.note,
    descripttion:
      'Don’t stress on adding all your budget categories afresh. Re-use this budget details.',
    action: 'delete',
  },
];

const Page = ({ params }: { params: { budgetId: string } }) => {
  const [showInviteCollaboratorDrawer, setShowInviteCollaboratorDrawer] =
    useState<boolean>(false);
  const [showDeleteBudgetModal, setShowDeleteBudgetModal] = useState<boolean>(false);
  const [showSuccessfulModal, setShowSuccessfulModal] = useState<boolean>(false);

  const navigate = useRouter();

  return (
    <div className="">
      <Header link="/budgets" title="Budget Settings" />
      <div className="p-6 space-y-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="p-4 bg-gray-100 border border-gray-200 rounded-[20px] flex gap-2"
            onClick={() => {
              if (action.action === 'invite') {
                setShowInviteCollaboratorDrawer(true);
              }
              if (action.action === 'delete') {
                setShowDeleteBudgetModal(true);
              }
            }}
          >
            <div className="text-gray-400 bg-white w-9 h-9 rounded-full flex items-center justify-center">
              {action.icon}
            </div>
            <div className="text-left space-y-1">
              <p className="font-medium text-black-800">{action.title}</p>
              <p className="text-xs text-gray-600">{action.descripttion}</p>
            </div>
            <span className="text-gray-400">{Icons.forwardArrow}</span>
          </button>
        ))}
      </div>
      {showInviteCollaboratorDrawer && (
        <InviteCollaboratorDrawer
          show={showInviteCollaboratorDrawer}
          setShow={setShowInviteCollaboratorDrawer}
          budgetId={params.budgetId}
        />
      )}
      <DeleteBudgetModal
        showDeleteBudgetModal={showDeleteBudgetModal}
        handleCloseDeleteModal={() => setShowDeleteBudgetModal(false)}
        budgetId={params.budgetId}
        handleOpenSuccessfulModal={() => setShowSuccessfulModal(true)}
      />
      <SuccessfulModal
        title="Deleted successfully"
        isOpen={showSuccessfulModal}
        onClose={() => {
          setShowSuccessfulModal(false);
          navigate.push('/budgets');
        }}
      />
    </div>
  );
};

export default Page;
