
'use client'
import Header from '@/components/header';
import { Accordion, AccordionItem } from "@nextui-org/react";
import React from 'react';

const Page = () => {
    const faqs = [
        {
            id: 1,
            title: 'Is there a free trial available?',
            description: 'Yes, you can enjoy the Prudy Money Master experience for free for a 14-day period.',
        },
        {
            id: 2,
            title: 'Can I change my plan later?',
            description: 'Yes, you can switch plans at no extra cost before your next billing date. For paid plans, changes take effect in the next billing cycle. However, upgrades from the free plan are immediate.',
        },
        {
            id: 3,
            title: 'What is your cancellation policy?',
            description: 'You can cancel your subscription at any time. However, the switch to the free plan will only take effect on the first day of your next billing cycle. For cancellations made during the free trial, your account will be immediately switched to the free plan.',
        },
        {
            id: 4,
            title: 'Can I download my budget reports?',
            description: 'Yes, budget reports are downloadable as PDF files with detail levels depending on your subscription plan',
        },
        {
            id: 5,
            title: 'How does billing work?',
            description: 'Billing is subscription-based and charged at the start of each billing cycle. You can choose between the Money Master or Unstoppable plans. If you select a free trial, your card will only be charged on the day your trial expires.',
        },
        // {
        //     id: 6,
        //     title: 'How do I change my account email?',
        //     description: 'Lorem ipsum dolor sit amet consectetur. Risus proin massa duis ut maecenas risus. Elit nam sed eget feugiat consectetur. Bibendum in tempus sed nunc arcu. Tempor sed nec consequat eu et ipsum amet.',
        // },
    ];

    return (
        <div>
            <Header link={`/profile`} title="FAQs" />
            <Accordion className=' px-[24px] pb-[24px]'>
                {faqs.map((faq) => (
                    <AccordionItem key={faq.id} aria-label={faq.title} title={faq.title}>
                        {faq.description}
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default Page;
