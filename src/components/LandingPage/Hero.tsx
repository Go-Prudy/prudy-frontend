import React from 'react';
import Header from './header';
import bg from '@/images/bg.webp';

const Hero = () => {
    return (
        <div
            style={{
                backgroundImage: `url(${bg.src}), linear-gradient(to top left, #ff0000, #ff0000)`
            }}
            className="w-screen h-screen bg-no-repeat bg-cover bg-[top_left] overflow-hidden"
        >
            {/* <Header /> */}
            ho
        </div>
    );
};

export default Hero;
