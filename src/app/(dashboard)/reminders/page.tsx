'use client';
import Header from '@/components/header';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@nextui-org/react';
import { BsChevronRight } from 'react-icons/bs';
import BottomDrawer from '@/components/create-budget/BottomDrawer';

const Page: React.FC = () => {
    const [showTimeModal, setShowTimeModal] = useState<boolean>(false);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [reminderType, setReminderType] = useState<string>('daily');

    // Initial state for reminders
    const [reminders, setReminders] = useState({
        daily: { active: false, time: 'Activate' },
        weekly: { active: false, time: 'Activate' },
        monthly: { active: false, time: 'Activate' },
    });

    // Function to generate times in 12-hour format with AM/PM
    const generateTimes = () => {
        const times: string[] = [];
        for (let i = 0; i < 24; i++) {
            const hour = i % 12 === 0 ? 12 : i % 12;
            const period = i < 12 ? 'AM' : 'PM';
            const time = `${hour.toString().padStart(2, '0')}:00 ${period}`;
            times.push(time);
        }
        return times;
    };

    const times = generateTimes();

    // Handle time selection
    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);

        // Automatically activate the reminder and update the time
        setReminders((prevState: any) => ({
            ...prevState,
            [reminderType]: {
                ...prevState[reminderType],
                time: time,
                active: true, // Set the reminder as active when time is selected
            },
        }));

        console.log(reminders);


        setShowTimeModal(false); // Close modal after selection
    };

    type ReminderType = 'daily' | 'weekly' | 'monthly';



    const toggleReminder = (type: ReminderType) => {
        // Check if the specific reminder time has been selected
        const isActive = reminders[type].time;

        // Show an alert if the reminder is not active
        if (isActive === 'Activate') {
            alert(`Please select a time to activate the ${type} reminder.`);
            return; // Exit the function early if the reminder is not active
        }

        // If a time is selected, toggle the active state
        setReminders((prevState) => ({
            ...prevState,
            [type]: {
                ...prevState[type],
                active: !prevState[type].active, // Toggle active state
            },
        }));
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 90 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-[100vw]"
            >
                <Header link={`/profile`} title="Notifications & Reminders" />
                <div className='flex flex-col gap-[16px] p-[24px]'>
                    {/* Daily Reminders */}
                    <div className='border rounded-[12px] border-[#EFEFF0] bg-[#F7F7F9] p-[16px]'>
                        <h1 className='leading-[28px] font-[500]'>Daily reminders</h1>
                        <div
                            className='mt-[8px] bg-[#FFFFFF] rounded-[12px] font-[400] text-[14px] text-[#828282] p-[12px] w-full flex justify-between items-center'
                            onClick={() => {
                                setReminderType('daily');
                                setShowTimeModal(true);
                            }}
                        >
                            <div className='flex gap-[8px] items-center'>
                                <>
                                    {reminders.daily.time === 'Activate' ?
                                        <>
                                            Activate
                                        </>
                                        :
                                        <>
                                            Remind me at: {reminders.daily.time}
                                        </>
                                    }</>
                                <span><BsChevronRight size={20} /></span>
                            </div>

                            <Switch
                                isSelected={reminders.daily.active}
                                onChange={() => toggleReminder('daily')}
                                className='h-[24px]'
                                color="success"

                            />
                        </div>
                    </div>

                    {/* Weekly Summary */}
                    <div className='border rounded-[12px] border-[#EFEFF0] bg-[#F7F7F9] p-[16px]'>
                        <h1 className='leading-[28px] font-[500]'>Weekly summary</h1>
                        <div
                            className='mt-[8px] bg-[#FFFFFF] rounded-[12px] font-[400] text-[14px] text-[#828282] p-[12px] w-full flex justify-between items-center'
                            onClick={() => {
                                setReminderType('weekly');
                                setShowTimeModal(true);
                            }}
                        >
                            <div className='flex gap-[8px] items-center'>

                                <>
                                    {reminders.weekly.time === 'Activate' ?
                                        <>
                                            Activate
                                        </>
                                        :
                                        <>
                                            Remind me at: {reminders.weekly.time}
                                        </>
                                    }</>
                                <span><BsChevronRight size={20} /></span>
                            </div>
                            <Switch
                                isSelected={reminders.weekly.active}
                                onChange={() => toggleReminder('weekly')}
                                className='h-[24px]'
                                color="success"
                            />
                        </div>
                    </div>

                    {/* Monthly Summary */}
                    <div className='border rounded-[12px] border-[#EFEFF0] bg-[#F7F7F9] p-[16px]'>
                        <h1 className='leading-[28px] font-[500]'>Monthly summary</h1>
                        <div
                            className='mt-[8px] bg-[#FFFFFF] rounded-[12px] font-[400] text-[14px] text-[#828282] p-[12px] w-full flex justify-between items-center'
                            onClick={() => {
                                setReminderType('monthly');
                                setShowTimeModal(true);
                            }}
                        >
                            <div className='flex gap-[8px] items-center'>
                                <>
                                    {reminders.monthly.time === 'Activate' ?
                                        <>
                                            Activate
                                        </>
                                        :
                                        <>
                                            Remind me at: {reminders.monthly.time}
                                        </>
                                    }</>
                                <span><BsChevronRight size={20} /></span>
                            </div>
                            <Switch
                                isSelected={reminders.monthly.active}
                                onChange={() => toggleReminder('monthly')}
                                className='h-[24px]'
                                color="success"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Time Picker Modal */}
            {showTimeModal && (
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[120vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                >
                    <BottomDrawer
                        label="Select time"
                        back={false}
                        show={showTimeModal}
                        close={true}
                        onClose={() => setShowTimeModal(false)}
                    >
                        <div className="flex h-[40vh] overflow-y-scroll w-full flex-wrap">
                            <ul className="time-picker-list   w-full text-center">
                                {times.map((time, index) => (
                                    <li
                                        key={index}
                                        className={`time-item py-[12px] items-center flex justify-center text-center ${index !== times.length - 1 ? 'border-b border-b-[#EFEFF0]' : ''} ${selectedTime === time ? 'selected' : ''}`}
                                        onClick={() => handleTimeSelect(time)}
                                    >
                                        {time}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </BottomDrawer>
                </motion.div>
            )}
        </div>
    );
}

export default Page;
