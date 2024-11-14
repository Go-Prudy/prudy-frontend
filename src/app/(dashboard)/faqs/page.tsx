
'use client'
import Header from '@/components/header';
import { Accordion, AccordionItem } from "@nextui-org/react";
import React from 'react';

const Page = () => {
    const faqs = [
        {
            id: 1,
            title: 'Is there a free trial available?',
            description: 'Lorem ipsum dolor sit amet consectetur. Risus proin massa duis ut maecenas risus. Elit nam sed eget feugiat consectetur. Bibendum in tempus sed nunc arcu. Tempor sed nec consequat eu et ipsum amet.',
        },
        {
            id: 2,
            title: 'Can I change my plan later?',
            description: 'Lorem ipsum dolor sit amet consectetur. Risus proin massa duis ut maecenas risus. Elit nam sed eget feugiat consectetur. Bibendum in tempus sed nunc arcu. Tempor sed nec consequat eu et ipsum amet.',
        },
        {
            id: 3,
            title: 'What is your cancellation policy?',
            description: 'Lorem ipsum dolor sit amet consectetur. Risus proin massa duis ut maecenas risus. Elit nam sed eget feugiat consectetur. Bibendum in tempus sed nunc arcu. Tempor sed nec consequat eu et ipsum amet.',
        },
        {
            id: 4,
            title: 'Can I download my budget reports?',
            description: 'Lorem ipsum dolor sit amet consectetur. Risus proin massa duis ut maecenas risus. Elit nam sed eget feugiat consectetur. Bibendum in tempus sed nunc arcu. Tempor sed nec consequat eu et ipsum amet.',
        },
        {
            id: 5,
            title: 'How does billing work?',
            description: 'Lorem ipsum dolor sit amet consectetur. Risus proin massa duis ut maecenas risus. Elit nam sed eget feugiat consectetur. Bibendum in tempus sed nunc arcu. Tempor sed nec consequat eu et ipsum amet.',
        },
        {
            id: 6,
            title: 'How do I change my account email?',
            description: 'Lorem ipsum dolor sit amet consectetur. Risus proin massa duis ut maecenas risus. Elit nam sed eget feugiat consectetur. Bibendum in tempus sed nunc arcu. Tempor sed nec consequat eu et ipsum amet.',
        },
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
