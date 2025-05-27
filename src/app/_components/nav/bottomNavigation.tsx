import Link from 'next/link';
import React from 'react';
import { ImportantNote } from '../importantNote';
import { usePathname } from 'next/navigation';
import cn from 'classnames';

const navItems = [
  {
    name: 'Home',
    icon: (isActive: boolean) =>
      isActive ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="m20.83 8.01-6.55-5.24C13 1.75 11 1.74 9.73 2.76L3.18 8.01c-.94.75-1.51 2.25-1.31 3.43l1.26 7.54C3.42 20.67 4.99 22 6.7 22h10.6c1.69 0 3.29-1.36 3.58-3.03l1.26-7.54c.18-1.17-.39-2.67-1.31-3.42ZM12.75 18c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-3c0-.41.34-.75.75-.75s.75.34.75.75v3Z"
            fill="currentColor"
          ></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="m9.02 2.84-5.39 4.2C2.73 7.74 2 9.23 2 10.36v7.41c0 2.32 1.89 4.22 4.21 4.22h11.58c2.32 0 4.21-1.9 4.21-4.21V10.5c0-1.21-.81-2.76-1.8-3.45l-6.18-4.33c-1.4-.98-3.65-.93-5 .12ZM12 17.99v-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      ),
    link: '/home',
  },
  {
    name: 'Budgets',
    icon: (isActive: boolean) =>
      isActive ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21.67 6.95c-.64-2.17-2.45-3.98-4.62-4.62-1.65-.48-2.79-.44-3.58.15-.95.71-1.06 1.99-1.06 2.9v2.49c0 2.46 1.12 3.71 3.32 3.71h2.87c.9 0 2.19-.11 2.9-1.06.61-.78.66-1.92.17-3.57Z"
            fill="currentColor"
          ></path>
          <path
            d="M18.91 13.361c-.26-.3-.64-.47-1.03-.47H14.3c-1.76 0-3.19-1.43-3.19-3.19v-3.58c0-.39-.17-.77-.47-1.03-.29-.26-.69-.38-1.07-.33-2.35.3-4.51 1.59-5.92 3.53-1.42 1.95-1.94 4.33-1.49 6.71.65 3.44 3.4 6.19 6.85 6.84.55.11 1.1.16 1.65.16 1.81 0 3.56-.56 5.05-1.65 1.94-1.41 3.23-3.57 3.53-5.92.05-.39-.07-.78-.33-1.07Z"
            fill="currentColor"
          ></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M18.32 12c2.6 0 3.68-1 2.72-4.28-.65-2.21-2.55-4.11-4.76-4.76C13 2 12 3.08 12 5.68v2.88C12 11 13 12 15 12h3.32Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M20 14.7a9.091 9.091 0 0 1-10.42 7.17c-3.79-.61-6.84-3.66-7.46-7.45A9.1 9.1 0 0 1 9.26 4.01"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      ),
    link: '/budgets',
  },
  {
    name: 'Track',
    icon: (isActive: boolean) =>
      isActive ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.38C2 19.83 4.17 22 7.81 22h8.38c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2ZM7.75 13.6c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-3.2c0-.41.34-.75.75-.75s.75.34.75.75v3.2Zm5 1.74c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8.66c0-.41.34-.75.75-.75s.75.34.75.75v6.68Zm5-1.74c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-3.2c0-.41.34-.75.75-.75s.75.34.75.75v3.2Z"
            fill="currentColor"
          ></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7 10.74v3.2M12 9v6.68M17 10.74v3.2M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      ),
    link: '/track',
  },
  {
    name: 'Analytics',
    icon: (isActive: boolean) =>
      isActive ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2ZM7.63 18.15c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-2.07c0-.41.34-.75.75-.75s.75.34.75.75v2.07Zm5.12 0c0 .41-.34.75-.75.75s-.75-.34-.75-.75V14c0-.41.34-.75.75-.75s.75.34.75.75v4.15Zm5.12 0c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-6.22c0-.41.34-.75.75-.75s.75.34.75.75v6.22Zm0-9.38c0 .41-.34.75-.75.75s-.75-.34-.75-.75V7.8a19.532 19.532 0 0 1-9.31 5.36c-.06.02-.12.02-.18.02-.34 0-.64-.23-.73-.57-.1-.4.14-.81.55-.91a18.07 18.07 0 0 0 8.75-5.11H14.2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h2.93c.04 0 .07.02.11.02.05.01.1.01.15.03.05.02.09.05.14.08.03.02.06.03.09.05.01.01.01.02.02.02.04.04.07.08.1.12.03.04.06.07.07.11.02.04.02.08.03.13.01.05.03.1.03.16 0 .01.01.02.01.03v2.93h-.01Z"
            fill="currentColor"
          ></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6.88 18.15v-2.07M12 18.15v-4.14M17.12 18.15v-6.22M17.12 5.85l-.46.54a18.882 18.882 0 0 1-9.78 6.04"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          ></path>
          <path
            d="M14.19 5.85h2.93v2.92"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      ),
    link: '/analytics',
  },
  {
    name: 'Profile',
    icon: (isActive: boolean) =>
      isActive ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 14.5c-5.01 0-9.09 3.36-9.09 7.5 0 .28.22.5.5.5h17.18c.28 0 .5-.22.5-.5 0-4.14-4.08-7.5-9.09-7.5Z"
            fill="currentColor"
          ></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM20.59 22c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      ),
    link: '/profile',
  },
];

type Props = {};

export default function BottomNavigation({}: Props) {
  const pathname = usePathname();
  const showImportantNote = pathname === '/track';
  return (
    <div className="fixed max-w-[680px] bottom-0 left-0 right-0 mx-auto z-20">
      {showImportantNote && <ImportantNote />}
      <div className="  bg-white shadow-[0px_-20px_56px_0px_#514F6E1A]">
        <ul className="flex items-center justify-between p-3">
          {navItems.map((item, index) => {
            const isActive = pathname === item.link;
            return (
              <Link key={index} href={item.link}>
                <li
                  className={cn(
                    'flex flex-col items-center gap-1 text-sm text-gray-500 hover:text-lemonGreen-600 p-3',
                    isActive ? 'text-lemonGreen-600' : 'text-gray-500 ',
                  )}
                >
                  <span>{item.icon(isActive)}</span>
                  <span>{item.name}</span>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
