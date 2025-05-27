import cn from 'classnames';
import Image, { StaticImageData } from 'next/image';
import CreateBudgetDrawer from '@/app/_components/drawers/CreateBudget';
import createBudgetImage from '/public/images/quick-actions/1.png';
import trackExpenseImage from '/public/images/quick-actions/6.png';
import linkBankImage from '/public/images/quick-actions/2.png';
import scanReceiptImage from '/public/images/quick-actions/3.png';
import useGetStarted from './useGetStarted';
import { CircularProgress } from '@nextui-org/react';
import ScanReceipt from '@/app/_components/scanner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';

interface QuickActionType {
  key: string;
  title: string;
  image: StaticImageData;
  bgColor: string;
  borderColor: string;
  size?: number;
}

const quickActions: QuickActionType[] = [
  {
    key: 'budget_creation',
    title: 'Create /n a Budget',
    image: createBudgetImage,
    bgColor: '#D7F4FB',
    borderColor: '#11CDEF',
  },
  {
    key: 'assign_expense',
    title: 'Track /n your Expenses',
    image: trackExpenseImage,
    bgColor: '#FBE9DA',
    borderColor: '#F39780',
    size: 46,
  },
  {
    key: 'receipt_scanning',
    title: 'Scan /n your Receipt',
    image: scanReceiptImage,
    bgColor: '#F4DEF2',
    borderColor: '#E149C0',
  },
  {
    key: 'account_linking',
    title: 'Link your /n Bank Accounts',
    image: linkBankImage,
    bgColor: '#D9D9FA',
    borderColor: '#3A36F5',
  },
];

type Props = {};

export default function GetStarted({}: Props) {
  const navigate = useRouter();
  const {
    linkAccountMutation,
    showScanner,
    setShowScanner,
    showCreateBudgetModal,
    setShowCreateBudgetModal,
    actionsProgress,
  } = useGetStarted();

  useEffect(() => {
    if (actionsProgress) {
      console.log(actionsProgress);
    }
  }, [actionsProgress]);

  return (
    <div className="rounded-[36px] border border-gray-200">
      <div className="flex items-center justify-between bg-gray-100 px-6 py-2.5 rounded-t-[36px]">
        <p className="text-black-900 font-medium text-sm sm:text-base">
          Get Started with Prudy
        </p>
        <div className="relative h-12 w-12">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              // background: 'conic-gradient(#66C227 0% 0%, #D9D9D9 0% 100%)',
              background: `conic-gradient(#66C227 0% ${actionsProgress?.percentage ?? 0}%, #D9D9D9 ${actionsProgress?.percentage ?? 0}% 100%)`,
            }}
          />
          <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center">
            <span className="text-black-800 text-xs font-bold">
              {actionsProgress?.percentage ?? 0}%
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {quickActions.map((action) => (
          <div
            key={action.key}
            className="p-4 space-y-2 rounded-3xl border text-black-800 relative"
            style={{
              borderColor: action.borderColor,
              backgroundColor: action.bgColor,
            }}
            onClick={() => {
              if (action.key === 'budget_creation') {
                setShowCreateBudgetModal(true);
              }
              if (action.key === 'assign_expense') {
                navigate.push('/track');
              }
              if (action.key === 'receipt_scanning') {
                setShowScanner(true);
              }
              if (action.key === 'account_linking') {
                linkAccountMutation.mutateAsync();
              }
            }}
          >
            {actionsProgress?.completedSteps?.includes(action.key) && (
              <div
                className={cn('absolute top-2 right-2')}
                style={{ color: action.borderColor }}
              >
                <BsCheck2Circle />
              </div>
            )}

            <div className={cn('bg-white rounded-xl w-fit', action.size ? 'p-0' : 'p-1')}>
              <Image
                src={action.image}
                alt={action.key}
                width={action.size || 34}
                height={action.size || 34}
              />
            </div>
            {action.key === 'account_linking' && linkAccountMutation.isPending ? (
              <CircularProgress size="sm" />
            ) : (
              <p className="text-xs sm:text-sm font-medium">
                {action.title.split('/n').map((part, index) => (
                  <span key={index}>
                    {part}
                    {index < action.title.split('/n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>
      {showCreateBudgetModal && (
        <CreateBudgetDrawer
          show={showCreateBudgetModal}
          setShow={setShowCreateBudgetModal}
        />
      )}
      <ScanReceipt showScanner={showScanner} setShowScanner={setShowScanner} />
    </div>
  );
}
