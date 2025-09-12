'use client';
import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import React from 'react';
import useNotifications from './useNotifications';
import Loader from '@/app/_components/loader';
import EmptyState from '@/app/_components/emptyState';
import emptyListImg from '/public/images/empty-state/list.png';
import { format, isToday, isYesterday } from 'date-fns';
import cn from 'classnames';
import ViewNotificationDrawer from '@/app/_components/drawers/ViewNotification';

const Page = () => {
  const {
    notifications,
    isGetNotificationsLoading,
    markAsReadMutation,
    markAllAsReadMutation,
    showNotification,
    setShowNotification,
    selectedNotification,
    setSelectedNotification,
  } = useNotifications();

  const groupedNotifications =
    notifications?.reduce((groups: any, notification: any) => {
      const date = new Date(notification.createdAt);
      let key;

      if (isToday(date)) {
        key = 'Today';
      } else if (isYesterday(date)) {
        key = 'Yesterday';
      } else {
        key = format(date, 'EEEE, dd MMMM, yyyy');
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(notification);
      return groups;
    }, {}) || {};

  return (
    <div className="">
      <InnerPageHeader isHeaderDark link="/home" title="Notifications" />
      {isGetNotificationsLoading ? (
        <Loader />
      ) : notifications && notifications?.length > 0 ? (
        <>
          <div className="space-y-2.5 p-6">
            <button
              disabled={markAllAsReadMutation.isPending}
              onClick={() => markAllAsReadMutation.mutateAsync()}
              className="text-[12px] font-medium text-gray-400"
            >
              {markAllAsReadMutation.isPending ? <Loader /> : 'Mark all as read'}
            </button>
            <div className="space-y-4">
              {Object.entries(groupedNotifications).map(
                ([date, notifications]: [string, any]) => (
                  <div key={date} className="space-y-2">
                    <h3 className="text-[12px] font-medium text-gray-400">{date}</h3>
                    {notifications.map((notification: any) => (
                      <div
                        key={notification?.id}
                        className={cn(
                          'cursor-pointer p-3 rounded-xl',
                          notification?.status === 'unread' ? 'bg-gray-100' : '',
                        )}
                        onClick={() => {
                          markAsReadMutation.mutate(notification?.id);
                          setShowNotification(true);
                          setSelectedNotification(notification);
                        }}
                      >
                        <div className="space-y-1">
                          <div className="font-medium flex justify-between">
                            <p className="text-black-700 text-base">
                              {notification?.title}
                            </p>
                            <div className="flex gap-1 items-center">
                              <p className="text-gray-400 text-[12px] max-w-[85px]">
                                at{' '}
                                {format(
                                  new Date(notification?.createdAt || ''),
                                  'hh:mm a',
                                )}
                              </p>
                              {notification?.status === 'unread' && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              )}
                            </div>
                          </div>
                          <p className="text-gray-300 text-xs">{notification?.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              )}
            </div>
          </div>
        </>
      ) : (
        <EmptyState image={emptyListImg} title="You don't have any notification" />
      )}

      {showNotification && (
        <ViewNotificationDrawer
          show={showNotification}
          setShow={setShowNotification}
          notification={selectedNotification}
        />
      )}
    </div>
  );
};

export default Page;
