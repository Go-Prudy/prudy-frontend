'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import BudgetPageHeader from '@/components/create-budget/BudgetPageHeader';
import pics from '/public/images/frame.webp';
import { BsPersonFill, BsPlus, BsThreeDotsVertical } from 'react-icons/bs';
import noBudgetImg from '/public/images/List 2.webp';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CreateBudget from '@/components/create-budget/CreateBudget';
import { CircularProgress, Skeleton } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteBudgetApi,
  fetchPreviousBudgetApi,
  GetAllBudgetsApi,
  inviteCollaboratorApi,
} from '@/app/services/BudgetService';
import { useAuthentication } from '@/app/store/AuthStore';
import InviteModal from '@/components/InviteModal';
import { getPendingInvitesApi } from '@/app/services/InviteService';
import { IPreviousBudget } from '@/app/types/budget';
import { useBudgetStore } from '@/app/store/Store';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import toast from 'react-hot-toast';
const BudgetPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showInvites, setShowInvites] = useState(false);
  const [createBudgetComponent, setCreateBudgetComponent] = useState(false);
  const [treshold, setTreshold] = useState(0);
  const navigation = useRouter();

  const [blinking, setBlinking] = useState(false);
  const [showInvite, setShowInvite] = useState<boolean>(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [inviteBudgetId, setInviteBudgetId] = useState<string | null>(null);
  // const [previousBudget, setPreviousBudget] = useState<IPreviousBudget | null>(null);
  const navigate = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { authenticatedUser } = useAuthentication();
  // console.log(authenticatedUser?.profile?.hasFreeTrial);

  const {
    data: budgets = [],
    isFetching,
    error,
    isPending,
    refetch: refetchAllBudgets,
  } = useQuery({
    queryKey: ['allBudgetCategories'],
    queryFn: () => GetAllBudgetsApi(authenticatedUser?.token ?? ''),
    enabled: !!authenticatedUser?.token,
    refetchOnWindowFocus: true,
  });

  const { data: getPendingInvitesApiData = [], status: getPendingInvitesStatus } =
    useQuery({
      queryKey: ['getPendingInvites'],
      queryFn: () => getPendingInvitesApi(authenticatedUser?.token ?? ''),
      enabled: !!authenticatedUser?.token,
      refetchOnWindowFocus: true,
    });

  const {
    previousBudget,
    setPreviousBudget,
    clearPreviousBudget: clearBudget,
  } = useBudgetStore();
  const [localPreviousBudget, setLocalPreviousBudget] = useState<IPreviousBudget | null>(
    null,
  );

  // const hasFreeTrialCookie = Cookies.get("hasFreeTrial");

  // const hasFreeTrial = hasFreeTrialCookie
  //     ? JSON.parse(hasFreeTrialCookie)
  //     : null;
  // useEffect(() => {
  //     if (hasFreeTrial === true) {
  //         Cookies.set("hasFreeTrial", "false", { expires: 365 * 100, secure: true });
  //         navigate.push('/subscription');
  //     }
  // }, [hasFreeTrial])

  useEffect(() => {
    if (getPendingInvitesApiData) {
      setShowInvites(true);
    } else {
      setShowInvites(false);
    }
  }, [getPendingInvitesStatus]);

  interface Partner {
    image: string;
    uid: string;
    name: string;
    picture: string;
  }

  interface AvatarGroupProps {
    partners: Partner[];
    expenseWidth: number;
  }

  const AvatarGroup: React.FC<AvatarGroupProps> = ({ partners, expenseWidth }) => {
    const maxAvatarsToShow = 3; // Maximum avatars to display
    const additionalCount = partners?.length - maxAvatarsToShow;

    return (
      <div
        className={`relative flex  items-center ${expenseWidth <= treshold ? 'mt-0' : 'mt-2'}`}
      >
        {partners
          ?.slice(0, maxAvatarsToShow)
          ?.map((partner, index) =>
            partner.picture ? (
              <Image
                key={partner.uid}
                width={32}
                height={32}
                src={partner.picture}
                alt={partner.name}
                className={`relative inline-block rounded-full border-2 border-white object-cover w-8 h-8 ${index > 0 ? '-ml-2' : ''}`}
                style={{ zIndex: maxAvatarsToShow - index }}
              />
            ) : (
              <BsPersonFill
                key={partner.uid}
                className={`relative size-[32px] p-1 inline-block rounded-full border-2 border-white text-[#828282] object-cover ${index > 0 ? '-ml-2' : ''}`}
              />
            ),
          )}

        {additionalCount > 0 && (
          <div className="relative ml-[-0.35rem] w-8 h-8 rounded-full border-2 border-white bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center">
            +{additionalCount}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    // HandleScroll function
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll); // Add event listener

    return () => {
      window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
    };
  }, []); // Empty dependency array to run only on mount

  const [isLoadingPreviousBudget, setIsLoadingPreviousBudget] = useState(false);

  const handleFetchPreviousBudget = async () => {
    if (localPreviousBudget) {
      // use local previous budget
      setPreviousBudget(localPreviousBudget);
      return;
    }
    // fetch using api
    try {
      setIsLoadingPreviousBudget(true);
      const previousBudgetResp = await fetchPreviousBudgetApi(
        authenticatedUser?.token ?? '',
      );
      //   console.log(previousBudgetResp);
      if (previousBudgetResp.success) {
        setPreviousBudget(previousBudgetResp.data);
        setLocalPreviousBudget(previousBudgetResp.data);
      }
    } catch (error) {
    } finally {
      setIsLoadingPreviousBudget(false);
    }
  };

  const clearPreviousBudget = async () => {
    clearBudget();
  };

  // React Query mutation to invite a collaborator
  const inviteCollaboratorMutation = useMutation({
    mutationFn: (email: string) =>
      inviteCollaboratorApi(authenticatedUser?.token ?? '', inviteBudgetId ?? '', email),
    onSuccess: () => {
      console.log('Invitation sent successfully!');
      setShowInvite(false); // Close drawer on success
      setCollaboratorEmail(''); // Clear the input
      setFormError(null);
    },
    onError: (error: unknown) => {
      console.error('Error inviting collaborator:', error);
    },
  });

  // Function to handle form submission for inviting a collaborator
  const handleInviteCollaborator = async (event: any) => {
    event.preventDefault();
    setFormError(null); // Clear previous error

    // Check if email includes "@"
    if (!collaboratorEmail.includes('@')) {
      setFormError('Please enter a valid email address containing "@"');
      return;
    }

    await inviteCollaboratorMutation.mutateAsync(collaboratorEmail);
  };

  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit(); // Triggers form submission, utilizing the native validation
    }
  };

  const queryClient = useQueryClient();

  // React Query mutation to delete budget
  const deleteBudgetMutation = useMutation({
    mutationFn: (id: string) => deleteBudgetApi(authenticatedUser?.token ?? '', id ?? ''),
    onSuccess: () => {
      console.log('Budget deleted successfully!');
      toast.success('Budget deleted');
      queryClient.invalidateQueries({
        queryKey: ['allBudgetCategories'],
      });
      setActiveTooltip(null);
    },
    onError: (error: unknown) => {
      console.error('Error inviting collaborator:', error);
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="  "
    >
      <div className=" overscroll-none">
        <div
          className="relative  w-full max-w-[500px] overscroll-none bg-no-repeat bg-contain bg-top transition-all duration-300 ease-out min-h-screen"
          style={{
            backgroundImage: `url(${pics.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <BudgetPageHeader headerType="budget" />
          <p className="px-6 pt-[136px] text-[32px] font-[700] text-white">
            Take charge of your income, budget effectively and track your finances
          </p>
          <div className="px-6 w-full relative max-w-[500px] ">
            {!scrolled ? (
              <button
                onClick={() => {
                  clearBudget();
                  setCreateBudgetComponent(!createBudgetComponent);
                }}
                className="mt-[24px] w-full justify-center items-center text-center font-[500] bg-[#8EF846] px-[28px] py-[16px] rounded-[32px] flex gap-[8px]"
              >
                <BsPlus size={30} />
                Create budget
              </button>
            ) : (
              <div className="z-[21] right-6 bottom-[240px] fixed w-fit">
                <button
                  onClick={() => {
                    clearBudget();
                    setCreateBudgetComponent(!createBudgetComponent);
                  }}
                  className=" top-[550px] mt-[24px] justify-center items-center text-center font-[500]  bg-[#8EF846]  p-[14px] w-fit rounded-[32px] flex gap-[8px]"
                >
                  <BsPlus size={30} />
                </button>
              </div>
            )}
          </div>
          <div className="bg-[#F7F7F9] mt-10 min-h-[389px] w-full rounded-t-[24px]">
            {isPending ? (
              <div className="flex flex-col mb-[90px] gap-[24px] p-[24px]">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-[100px] w-full rounded-[20px]" />
                ))}
              </div>
            ) : budgets?.length === 0 ? (
              <div className="py-[65px] text-center flex-col gap-[8px] flex justify-center items-center px-[51px]">
                <Image
                  src={noBudgetImg.src}
                  width={1000}
                  height={1000}
                  className="size-[124px] mb-[8px]"
                  alt=""
                />
                <h1 className="font-[500] leading-[24px]">
                  You do not have any budget history yet.
                </h1>
                <h1 className="text-[14px] text-[#828282] leading-[16.8px]">
                  Click the create button above to <br /> get started.
                </h1>
              </div>
            ) : (
              <div className="flex flex-col pb-[90px] gap-[24px] p-[24px]">
                {budgets?.map((budget: any, index: any) => {
                  const totalBudgetIncome = Number(budget?.totalIncome) || 0;
                  const totalBudgetExpenses = Number(budget?.totalExpenses) || 0;

                  const maxBudgetValue =
                    Math.max(totalBudgetIncome, totalBudgetExpenses) || 0;

                  const incomeWidth =
                    maxBudgetValue > 0
                      ? Math.min((totalBudgetIncome / maxBudgetValue) * 100, 100)
                      : 0;
                  const expenseWidth =
                    maxBudgetValue > 0
                      ? Math.min((totalBudgetExpenses / maxBudgetValue) * 100, 100)
                      : 0;

                  const dynamicThreshold =
                    (totalBudgetIncome / maxBudgetValue) * 100 || 15;

                  return (
                    <div
                      onClick={() => navigation.push(`/budget/${budget.uid}`)}
                      key={index}
                      className="bg-[#EFEFF0] rounded-[20px] flex flex-col relative border-[1px] border-[#E7E7EA] gap-[8px] p-[16px]"
                    >
                      <div className="w-full justify-between items-center flex">
                        <h1 className="text-[16px] font-[500] leading-[24px]">
                          {budget.name}
                        </h1>
                        <div className="flex items-center text-[12px] gap-[12px] text-[#828282]">
                          <button className="bg-[#FFFFFF] rounded-[10px] px-[8px] py-[2px]">
                            {budget.type}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTooltip(
                                activeTooltip === budget.uid ? null : budget.uid,
                              );
                            }}
                            className="bg-[#FFFFFF] z-[20] rounded-[10px] px-[8px] py-[2px]"
                          >
                            <BsThreeDotsVertical />
                          </button>
                          {activeTooltip === budget.uid && (
                            <div className="absolute z-[12] bg-white border flex flex-col gap-[8px] top-[40px] right-[10px] rounded shadow-md mt-2 p-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTooltip(null);
                                }}
                                className="block w-full text-left"
                              >
                                Duplicate
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBudgetMutation.mutate(budget.uid);
                                }}
                                className="block w-full text-left"
                              >
                                {deleteBudgetMutation.isPending
                                  ? 'deleting...'
                                  : 'Delete'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInviteBudgetId(budget.uid);
                                  setShowInvite(!showInvite);
                                  setActiveTooltip(null);
                                }}
                                className="block w-full text-left"
                              >
                                Invite Collaborator
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-[8px] flex flex-col gap-[8px] w-full">
                        <div className="flex flex-col gap-[4px]">
                          <h1 className="flex justify-between w-full">
                            <span className="text-[#575757] text-[10px]">Income</span>
                            <span className={`text-[#575757] font-[500] text-[12px]`}>
                              {totalBudgetIncome.toLocaleString('en-NG', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          </h1>
                          <div className="relative w-full bg-[#EFEFF0] rounded-[4px]">
                            <div
                              style={{
                                width: `${incomeWidth}%`,
                                backgroundColor: '#01B0C5',
                                maxWidth: '100%',
                              }}
                              className="h-[8px] rounded-[4px]"
                            />
                          </div>
                        </div>

                        <div
                          style={{
                            width: `${expenseWidth}%`,
                            maxWidth: '100%',
                          }}
                          className="flex flex-col relative  gap-[4px]"
                        >
                          <h1 className="flex justify-between w-full">
                            <span className="text-[#575757] text-[10px]">Expenses</span>
                            <span
                              className={` ${expenseWidth <= dynamicThreshold ? 'hidden' : 'block'} text-[#575757] font-[500] text-[12px]`}
                            >
                              ₦ {totalBudgetExpenses.toLocaleString()}
                            </span>
                          </h1>
                          <div className="relative w-full bg-[#EFEFF0] rounded-[4px]">
                            <div
                              style={{
                                width: `${expenseWidth}%`,
                                backgroundColor: '#FB8417',
                                maxWidth: '100%',
                              }}
                              className="h-[8px] rounded-[4px]"
                            />
                          </div>
                          <div
                            className={` flex  ${expenseWidth <= dynamicThreshold ? 'block' : 'hidden'}   text-[#575757] font-[500] text-[12px]`}
                          >
                            ₦{totalBudgetExpenses.toLocaleString()}
                          </div>
                        </div>
                        <div className=" z-1 relative w-full">
                          {budget?.collaborators.length === 0 ? null : (
                            <AvatarGroup
                              partners={budget?.collaborators}
                              expenseWidth={3}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {createBudgetComponent && (
          <CreateBudget
            show={createBudgetComponent}
            setShow={setCreateBudgetComponent}
            previousBudget={previousBudget}
            fetchPreviousBudget={handleFetchPreviousBudget}
            isLoadingPreviousBudget={isLoadingPreviousBudget}
            clearPreviousBudget={clearPreviousBudget}
          />
        )}
        {showInvites && getPendingInvitesApiData.length > 0 && (
          <InviteModal
            refetchAllBudgets={refetchAllBudgets}
            getPendingInvitesApiData={getPendingInvitesApiData}
            show={showInvites}
            setShow={setShowInvites}
          />
        )}
        {showInvite && (
          <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-[100vh] w-full z-[40] max-w-[500px] bottom-0 fixed bg-[#1c1c1c73]"
          >
            <div>
              <BottomDrawer
                footer={
                  <button
                    ref={buttonRef}
                    type="button"
                    onClick={handleButtonClick}
                    className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]"
                    disabled={inviteCollaboratorMutation.isPending}
                  >
                    {inviteCollaboratorMutation.isPending ? 'Inviting...' : 'Send invite'}
                  </button>
                }
                label="Invite collaborator to budget"
                back={false}
                show={showInvite}
                close={true}
                onClose={() => setShowInvite(false)}
              >
                <form onSubmit={handleInviteCollaborator} ref={formRef}>
                  <div className="relative w-full mb-4">
                    <div className="z-[10] flex w-[90%] absolute top-[30px] left-4 text-xs justify-between items-center">
                      <label
                        htmlFor="Email address"
                        className="relative h-fit w-fit z-[10] text-[#828282]"
                      >
                        Email address
                      </label>
                    </div>
                    <input
                      type="email"
                      name="Email address"
                      id="Email address"
                      required
                      placeholder="Enter email address"
                      value={collaboratorEmail}
                      onChange={(e) => setCollaboratorEmail(e.target.value)}
                      className="bg-[#F7F7F9] mt-[20px] font-[500] border border-[#EFEFF0] placeholder:text-[#575757] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2"
                    />
                    {/* Display form validation error */}
                    {formError && <p className="text-red-500 mt-2">{formError}</p>}
                  </div>
                </form>
              </BottomDrawer>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BudgetPage;
