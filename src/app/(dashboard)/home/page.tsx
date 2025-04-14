'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import DashboardHeader from '@/components/Header/DashboardHeader';
import SectionHeader from '@/components/Header/SectionHeader';
import CreateBudgetDrawer from '@/app/_components/drawers/CreateBudget';

// import images
import homeHeaderIcon from '/public/images/header/home.png';
import createBudgetImage from '/public/images/quick-actions/1.png';
import linkBankImage from '/public/images/quick-actions/2.png';
import scanReceiptImage from '/public/images/quick-actions/3.png';
import reviewExpenseImage from '/public/images/review-expense.png';
import homeAnalyticsImage from '/public/images/home-analytics.png';
import DashboardWrapper from '@/app/_components/dashboardWrapper';

interface QuickActionType {
  id: string;
  title: string;
  description: string;
  image: StaticImageData;
  bgColor: string;
  borderColor: string;
}

const quickActions: QuickActionType[] = [
  {
    id: 'create',
    title: 'Create a Budget',
    description: 'Lorem ipsum dolor sit amet consectetur. ',
    image: createBudgetImage,
    bgColor: '#D7F4FB',
    borderColor: '#11CDEF',
  },
  {
    id: 'link',
    title: 'Link your Bank Accounts',
    description: 'Lorem ipsum dolor sit amet consectetur. ',
    image: linkBankImage,
    bgColor: '#D9D9FA',
    borderColor: '#3A36F5',
  },
  {
    id: 'scan',
    title: 'Scan your Receipt',
    description: 'Lorem ipsum dolor sit amet consectetur. ',
    image: scanReceiptImage,
    bgColor: '#F4DEF2',
    borderColor: '#E149C0',
  },
];

const HomePage = () => {
  const [showCreateBudgetModal, setShowCreateBudgetModal] = useState<boolean>(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-[90px]"
    >
      <DashboardWrapper>
        <div className="relative w-full max-w-[500px] transition-all duration-300 ease-out min-h-screen">
          <DashboardHeader
            type="home"
            headerTitle="Take the first step to financial freedom."
            headerIcon={homeHeaderIcon}
            headerIconClass="mr-[-24px] w-[120px]"
            description="Budget & track your expenses easily."
          />

          <div className="space-y-6 p-6">
            {/* quick actions */}
            <div className="space-y-3">
              <SectionHeader title="Quick Actions" />
              <Swiper
                // modules={[Navigation]}
                // navigation
                slidesPerView={2.13}
                spaceBetween={20}
                className="w-full max-w-[84vw]"
              >
                {quickActions.map((action) => (
                  <SwiperSlide
                    key={action.id}
                    className="p-4 space-y-2 rounded-3xl border text-black-800 min-w-[160px]"
                    style={{
                      borderColor: action.borderColor,
                      backgroundColor: action.bgColor,
                    }}
                    onClick={() => {
                      if (action.id === 'create') {
                        setShowCreateBudgetModal(true);
                      }
                    }}
                  >
                    <div className="bg-white rounded-xl w-fit p-1">
                      <Image src={action.image} alt={action.id} width={54} height={54} />
                    </div>
                    <h5 className="text-base font-medium">{action.title}</h5>
                    <p className="text-sm">{action.description}</p>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* review expenses */}
            <Link href="/track" className="inline-block">
              <div className="flex items-center gap-2 p-4 rounded-3xl bg-gray-100 border border-gray-200">
                <div className="bg-white rounded-xl w-fit p-1">
                  <Image src={reviewExpenseImage} alt="" width={54} height={54} />
                </div>
                <div>
                  <h5 className="text-base font-medium">Review your Expenses</h5>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur. Natoque id sollicitudin{' '}
                  </p>
                </div>
              </div>
            </Link>

            {/* analytics */}
            <Link href="/analytics" className="inline-block">
              <div className="relative mt-4">
                <div className="absolute inset-0 -top-4 bg-[#F89446] rounded-3xl w-[80%] mx-auto" />
                <div className="absolute inset-0 -top-2 bg-[#11CDEF] rounded-3xl w-[90%] mx-auto" />
                <div
                  style={{
                    background:
                      'radial-gradient(163.31% 501.24% at 36.22% 30.66%, #7544D4 0%, #C09FFF 100%)',
                  }}
                  className="px-6 py-4 rounded-3xl text-white flex items-center relative z-10"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">
                      Where did <br /> your money go?
                    </h3>
                    <p className="text-sm">
                      See what your spending patterns looked like last week
                    </p>
                  </div>
                  <Image
                    className="my-[-30px] -mr-5"
                    src={homeAnalyticsImage}
                    alt=""
                    width={150}
                    height={150}
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </DashboardWrapper>
      {showCreateBudgetModal && (
        <CreateBudgetDrawer
          show={showCreateBudgetModal}
          setShow={setShowCreateBudgetModal}
        />
      )}
    </motion.div>
  );
};

export default HomePage;
