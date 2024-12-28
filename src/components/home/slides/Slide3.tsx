'use client'
import React, { useEffect, useState } from 'react';
import FadeTransition from '@/components/fade-transition';
import ForwardArrow from '@/icons/forward-arrow';
import { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import slide2Img from '@/images/couple.webp';
import slide3Img from '@/images/pwoman.webp';
import slide4Img from '@/images/chart.webp';
import FirstSlidePic from '@/images/woman.webp';
interface Slide3Props {
    slide: number;
    handlePrev: () => void;
    handleNext: () => void;
}

const Slide3: React.FC<Slide3Props> = ({ slide, handlePrev, handleNext }) => {
    // State to hold the current background image
    const [backgroundImage, setBackgroundImage] = useState(FirstSlidePic.src);
    const navigate = useRouter()
    useEffect(() => {
        switch (slide) {
            case 0:
                setBackgroundImage(FirstSlidePic.src); // Use the src property
                break;
            case 1:
                setBackgroundImage(slide2Img.src); // Use the src property
                break;
            case 2:
                setBackgroundImage(slide3Img.src); // Use the src property
                break;
            case 3:
                setBackgroundImage(slide4Img.src); // Use the src property
                break;
            default:
                setBackgroundImage(slide2Img.src);
        }
    }, [slide]);
    return (
        <div
            className="max-w-[500px] min-h-[944px] bg-no-repeat bg-black relative bg-contain bg-top transition-all duration-300 ease-out"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >

            <div className="absolute h-full bg-gradient-to-b top-0 to-[#121212] from-[#ffffff05] left-0 px-6 w-full"></div>
            <div className="fixed top-0 left-0 w-full h-full" style={{ background: 'linear-gradient(180.32deg, #12121200 -16.27%, black 67.38%)' }}></div>

            <div className="fixed mt-[432px] bg-gradient-to-b to-[#070D04] via-[#070D04] from-[#ffffff00] py-[40px] bottom-10 left-0 px-6 w-full">
                <div className="px-6 pt-6 pb-10 transition-all ease-in bg-[#121212] min-h-10 w-full border border-[#212121] rounded-3xl">
                    <FadeTransition shouldChange={String(slide)}>
                        {slide === 0 && (
                            <h1 className="text-3xl font-bold mb-6">
                                <span className="text-lemonGreen-600 italic">Easy budgeting & tracking </span>
                                <span className="text-white">like you’ve never known</span>
                            </h1>
                        )}
                        {slide === 1 && (
                            <h1 className="text-3xl font-bold mb-6">
                                <span className="text-lemonGreen-600 italic">Collaborate </span>
                                <span className="text-white">with your loved ones</span>
                            </h1>
                        )}
                        {slide === 2 && (
                            <h1 className="text-3xl font-bold mb-6">
                                <span className="text-lemonGreen-600 italic">Link </span>
                                <span className="text-white">your bank accounts easily</span>
                            </h1>
                        )}
                        {slide === 3 && (
                            <h1 className="text-3xl font-bold mb-6">
                                <span className="text-lemonGreen-600 italic">Insightful analytics </span>
                                <span className="text-white">to keep you abreast of your spending patterns</span>
                            </h1>
                        )}
                    </FadeTransition>
                    <p className="text-gray-500">Simple, smart, and stress-free. Do it the Prudy way.</p>
                    <div className="flex justify-between mt-10">
                        <div className="inline-flex justify-center items-center gap-1">
                            {Array.from(Array(4).keys()).map((el) => (
                                <div
                                    key={el}
                                    className={`rounded-full h-2 transition-all duration-200 ${el === slide ? 'bg-lemonGreen-600 w-8' : 'bg-gray-600 w-2'}`}
                                />
                            ))}
                        </div>
                        <div className="inline-flex gap-4">
                            <button
                                className="rotate-180 w-14 h-14 hover:bg-[#2D2D2D] border border-gray-600 rounded-full inline-flex justify-center items-center"
                                onClick={handlePrev}
                            >
                                <ForwardArrow className="text-white" />
                            </button>
                            <button
                                className={`w-14 h-14 border border-gray-600 rounded-full inline-flex justify-center items-center ${slide === 3 ? 'bg-[#8EF846]' : 'hover:bg-[#2D2D2D]'
                                    }`}
                                onClick={() => {
                                    slide !== 3 ?
                                        handleNext() : navigate.push('/signup')
                                }}
                            >
                                <ForwardArrow className={`text-white ${slide === 3 ? 'text-black' : 'text-white'}`} />
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Slide3;
