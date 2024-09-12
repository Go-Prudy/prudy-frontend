import Header2 from "@/components/create-budget/Header2";
import Image from "next/image";
import linkIcon from '@/images/Mindmap.png'
import Icon1 from '@/images/Add Category.png'
import Icon2 from '@/images/Write Content.png'
import Icon3 from '@/images/Add Files.png'
import { BsChevronRight } from "react-icons/bs";
export default function Page() {

  // Define the type for the array items  
  interface CardItem {
    color: string;
    title: string;
    subtext: string;
    btnText: string;
    border: string;
    image: any; // Assuming the image is a URL or path  
    buttonColor: string;
  }

  // Create the array of card items
  const cardItems: CardItem[] = [
    {
      color: '#E0E7FF', // Light blue
      title: 'Assign transactions from your bank account',
      subtext: 'Assign your transactions from your bank account to the right budget category and win 20 points',
      btnText: 'Assign now',
      border: '1px solid #F3F0FA', // Example border color
      image: Icon1, // Replace with actual image path
      buttonColor: '#8A62D8'
    },
    {
      color: '#FDF4EC', // Light yellow
      title: 'Scan your receipts',
      subtext: 'Scan receipts from shopping to track the expenses effectively',
      btnText: 'Scan now',
      border: '1px solid #FBE9DA', // Example border color
      image: Icon2, // Replace with actual image path
      buttonColor: '#E67731'
    },
    {
      color: '#EBFAFD', // Light cyan
      title: 'Add manually',
      subtext: 'Add your expense details manually',
      btnText: 'Add now',
      border: '1px solid #D7F4FB', // Example border color
      image: Icon3, // Replace with actual image path
      buttonColor: '#11CDEF'
    },
  ];

  return (
    <div className="bg-base-white h-full">
      <Header2 title={'Track expenses'} />

      <div className=" mt-[90px] p-[24px]   mb-[16px]">
        <h1 className=" text-[18px] font-[500] leading-[21.6px]">Linked Accounts</h1>

        <div className=" border-[#EFEFF0] mb-[24px] mt-[19px] justify-center items-center  rounded-[24px] flex flex-col  p-[24px] bg-[#F7F7F9] border-[1px] ">
          <Image src={linkIcon} className=" w-[94.42px] object-contain h-[84px] " width={1000} height={1000} alt="goprudy" />
          <h1 className=" font-[500] text-center text-[#2D2D2D] leading-[19.2px]">Link your bank accounts to track your transactions easily</h1>
          <button className=" text-[14px] mt-[8px] w-[108px] rounded-[32px] bg-[#66C227] px-[16px] py-[6px] text-[#FAFAFA] items-center justify-center flex gap-[4px] leading-[20px] text-center">
            Link now <BsChevronRight />
          </button>

        </div>
        <h1 className=" font-[500]  text-[#2D2D2D] mt-[28px] text-[18px]">3 ways to track your expenses</h1>
        <div className=" w-full mt-[24px]">
          <div className=" flex flex-col gap-[24px]">
            {cardItems.map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: item.color,
                  border: item.border,
                  borderRadius: '24px',
                  padding: '16px',
                }}
                className=" w-full"
              >
                <div className="mb-[12px] items-center  flex gap-[0px]">
                  <div className=" relative w-[57.14px]    h-[50px]">
                    <img src={item.image.src} alt={item.title} className="  w-full  top-0 left-[-12px]  absolute  h-full" />
                  </div>

                  <h2 className="font-[500] mr-2 pb-[22px] leading-[19.2px]">{item.title}</h2>
                </div>

                <p className="text-[14px] leading-[20px]">{item.subtext}</p>
                <div className=" flex-1 flex  justify-end mt-[16px] w-full">
                  <button
                    style={{ color: item.buttonColor }}
                    className=" items-center text-[12px] font-[500]   px-[18px] py-[8px] flex shadow-sm gap-[4px] rounded-[16px] bg-white"
                  >
                    {item.btnText}
                    <BsChevronRight />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
      <div className=" bg-[#FAFAFA] pb-[106px] w-full ">

      </div>

    </div>
  );
}
