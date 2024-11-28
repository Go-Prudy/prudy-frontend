import React from 'react'

import { Card, Skeleton } from "@nextui-org/react";

interface TopExpensesSkeletonProps {
    showButton?: boolean;
    itemsCount?: number;
}

export function TopExpensesSkeleton({
    showButton = true,
    itemsCount = 3,
}: TopExpensesSkeletonProps) {
    return (
        <div className="w-full px-[24px]">
            {/* Top Section Skeleton */}
            <div className="p-[24px] w-full rounded-t-[24px] border-[1px] border-[#EFEFF0]">
                {/* Section Title */}
                <Skeleton className="w-2/5 h-[18px] mb-[16px] rounded-lg" />
                {/* List Items Skeleton */}
                <div className="w-full flex flex-col gap-[12px]">
                    {Array.from({ length: itemsCount }).map((_, index) => (
                        <div
                            key={index}
                            className="flex rounded-[12px] border border-[#EFEFF0] bg-[#F7F7F9] p-[8px] justify-between w-full"
                        >
                            {/* Left Side */}
                            <div className="flex gap-[8px] items-center">
                                <Skeleton className="w-[24px] h-[24px] rounded-full" />
                                <Skeleton className="w-[80px] h-[12px] rounded-lg" />
                            </div>
                            {/* Right Side */}
                            <Skeleton className="w-[60px] h-[14px] rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Section Skeleton */}
            <div className="rounded-b-[24px] pb-[24px] pt-[16px] bg-[#F3F0FA] px-[24px]">
                {/* Remark Title */}
                <Skeleton className="w-3/5 h-[18px] rounded-lg" />
                {/* Remark Description */}
                <Skeleton className="w-full h-[18px] mt-[8px] rounded-lg" />
                {/* Optional Button */}
                {showButton && (
                    <Skeleton className="mt-[16px] rounded-[20px]">
                        <div className="h-[40px] w-full bg-white"></div>
                    </Skeleton>
                )}
            </div>
        </div>
    );
}

export function BudgetVsActualSkeleton() {
    return (
        <div className="px-[24px]">
            <div className="p-[24px] rounded-t-[24px] border-[1px] border-[#EFEFF0]">
                <Skeleton className="w-2/5 h-[18px] mb-[16px] rounded-lg">
                    <div className="h-[18px] bg-[#EFEFF0]"></div>
                </Skeleton>

                <div className="space-y-4">
                    {/* Skeleton for Budget bar */}
                    <Skeleton className="rounded-r-[8px]">
                        <div className="h-[24px] w-full bg-[#66C227]"></div>
                    </Skeleton>
                    {/* Skeleton for Actual bar */}
                    <Skeleton className="rounded-r-[8px]">
                        <div className="h-[24px] w-[80%] bg-[#F89446]"></div>
                    </Skeleton>
                </div>
            </div>

            <div className="rounded-b-[24px] pb-[24px] pt-[16px] bg-[#F3F0FA] px-[24px]">
                <div className="space-y-4">
                    {/* Skeleton for Remark title */}
                    <Skeleton className="w-3/5 h-[18px] rounded-lg">
                        <div className="h-[18px] bg-[#EFEFF0]"></div>
                    </Skeleton>
                    {/* Skeleton for Remark description */}
                    <Skeleton className="w-full h-[18px] rounded-lg">
                        <div className="h-[18px] bg-[#EFEFF0]"></div>
                    </Skeleton>
                    {/* Skeleton for Button */}
                    <Skeleton className="rounded-[20px]">
                        <div className="h-[40px] bg-white"></div>
                    </Skeleton>
                </div>
            </div>
        </div>
    );
}
