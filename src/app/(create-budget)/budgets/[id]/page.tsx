'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';
import pics from '@/images/frame.webp';
const Page = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[100vw]"
            style={{
                backgroundImage: `url(${pics.src})`, // Access the 'src' property for the image URL
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Header light={false} link="/budgets" title="Create new budget" />
        </motion.div>
    );
};

export default Page;
