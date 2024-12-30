'use client'
import Header2 from "@/components/create-budget/Header2";
import Image from "next/image";
import { BsChevronRight, BsPerson } from "react-icons/bs";
import premium from "@/images/premium2.png";
import logout from "@/images/logout.png";
import budgetIcon from "@/images/category-2.png";
import collaborationIcon from "@/images/collaborationicon.png";
import reminderIcon from "@/images/remindericon.png";
import subscriptionIcon from "@/images/subscriptionicon.png";
import reportIcon from "@/images/reporticon.png";
import faqIcon from "@/images/faq.png";
import passcodeIcon from "@/images/passcode.png";
import currencyIcon from "@/images/currency.png";
import { FaClipboardList, FaUsers, FaBell, FaDollarSign, FaChartPie, FaQuestionCircle, FaLock, FaGlobe } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuthentication } from "@/app/store/AuthStore";
import { IAuthenticatedUser } from "@/app/Types";
import { useEffect, useState } from "react";
import Link from 'next/link';

export default function Page() {


  type ToolItem = {
    title: string;
    icon: JSX.Element; // Assuming you want to add an icon component here
    category: string;
    link: string; // Link property added
  };

  const toolItems: ToolItem[] = [
    { title: 'Budget Categories', icon: <Image className=" w-[20px] h-[20px]" width={1000} height={1000} alt="icon" src={budgetIcon} />, category: 'TOOLS', link: '/budgets/categories' },
    { title: 'Reminders', icon: <Image className=" w-[20px] h-[20px]" width={1000} height={1000} alt="icon" src={reminderIcon} />, category: 'TOOLS', link: '/reminders' },
    { title: 'Subscription', icon: <Image className=" w-[20px] h-[20px]" width={1000} height={1000} alt="icon" src={subscriptionIcon} />, category: 'TOOLS', link: '/subscription' },
    { title: 'Reports', icon: <Image className=" w-[20px] h-[20px]" width={1000} height={1000} alt="icon" src={reportIcon} />, category: 'TOOLS', link: '/reports' },
    { title: 'FAQs', icon: <Image className=" w-[20px] h-[20px]" width={1000} height={1000} alt="icon" src={faqIcon} />, category: 'TOOLS', link: '/faqs' },
    { title: 'Passcode Settings', icon: <Image className=" w-[20px] h-[20px]" width={1000} height={1000} alt="icon" src={passcodeIcon} />, category: 'SETTINGS', link: '/settings/passcode' },
    { title: 'Currency & Data', icon: <Image className=" w-[20px] h-[20px]" width={1000} height={1000} alt="icon" src={currencyIcon} />, category: 'SETTINGS', link: '/settings/currency' },
  ];

  const navigation = useRouter()

  const { LogOut } = useAuthentication();

  const logOutMutation = useMutation({
    mutationFn: async () => LogOut(),
    onSuccess: (data) => {
      console.log('Logout successful', data);
    },
    onError: (error) => {
      console.error('Error during logout:', error);
    },
  });

  // Example of using the logout mutation in a component
  const handleLogout = () => {
    logOutMutation.mutate();
  };

  const { authenticatedUser } = useAuthentication();
  const [userData, setUserData] = useState<IAuthenticatedUser>({
    token: '',
    profile: {
      createdAt: '',
      updatedAt: '',
      uid: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      registeredWith: '',
      isVerified: false,
      hasOnboarded: false,
      accountProviderId: '',
      profilePhotoUrl: '',
    }
  });

  useEffect(() => {
    if (authenticatedUser) {
      setUserData(authenticatedUser);
    }
  }, [authenticatedUser]);
  return (
    <div className="bg-[#FAFAFA]  w-[100vw] max-w-[500px]  h-screen">
      <Header2 title={'Profile'} />
      <div onClick={() => navigation.push('/profile/user')} className="cursor-pointer pt-[90px] px-[24px] pb-[24px]">
        <Link href="/profile/user" prefetch={true}>
          <div className="text-[hsl(0,0%,100%)] p-[24px] flex justify-between items-center w-full rounded-[20px]" style={{
            background: 'linear-gradient(0deg, #66C227 15.2%, #2A860A 74.4%)',
          }}>
            <div className='flex items-center gap-[8px]'>
              <div className={`flex items-center rounded-full border-1 border-[#FFFFFF] ${!userData.profile.profilePhotoUrl ? 'p-1' : 'p-0'}`}>
                {userData.profile.profilePhotoUrl ?
                  <Image
                    src={userData.profile.profilePhotoUrl}
                    alt="profile"
                    width={1000}
                    height={1000}
                    className="size-[52px] rounded-full object-cover"
                  />
                  :
                  <BsPerson className='text-[#FFFFFF] size-[52px]' />
                }
              </div>
              <div className='flex gap-[4px] flex-col'>
                <h1 className='font-[500] text-[#FFFFFF] leading-[24px]'>
                  {userData.profile.lastName ? `${userData.profile.firstName} ${userData.profile.lastName}` : 'User'}
                </h1>
                <Image className='w-[74px] h-[24px]' alt='premium' width={1000} height={1000} src={premium} />
              </div>
            </div>
            <BsChevronRight size={24} />
          </div>
        </Link>
      </div>


      <div className=" border-t-1 bg-[#FAFAFA]   border-[#EFF0F6] py-[24px] ">
        <div className=" px-[24px]">
          <div className="">
            {['TOOLS', 'SETTINGS'].map((category) => (
              <div key={category} className="mb-8">
                <h1 className=" text-[#575757] text-[14px]">
                  {category}</h1>
                <div className="grid grid-cols-2 gap-4">
                  {toolItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <div
                        key={item.title}
                        onClick={() => navigation.push(item.link)}
                        className="flex items-center gap-4 p-4 border border-[#EFEFF0] rounded-[20px] bg-[#F7F7F9] hover:shadow-sm"
                      >
                        <div className="w-[40px] h-[40px] flex items-center justify-center text-[#888888] bg-[#Fff]  rounded-full">
                          {item.icon}
                        </div>
                        <h1 className="text-[14px] text-[#474747]">{item.title}</h1>
                      </div>
                    ))}
                </div>
              </div>
            ))}


            <button onClick={() => handleLogout()} className=" items-center mb-[24px] py-[12px] rounded-[12px] gap-[8px] text-center flex justify-center w-full bg-[#FBEDEF] text-[#D2303E] font-[500]"><Image src={logout} width={1000} className=" size-[24px]" height={1000} alt="logout" /> Logout </button>
          </div>
        </div>

      </div>


    </div>
  );
}
