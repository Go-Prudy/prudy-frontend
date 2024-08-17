'use client';

import ChartIcon from '@/icons/chart';
import HomeIcon from '@/icons/home';
import NoteIcon from '@/icons/note';
import UserIcon from '@/icons/user';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navStyle = {
  boxShadow: '0px -8px 56px 0px #132F001F',
};

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="h-20 p-3 w-full" style={navStyle}>
      <ul className="list-none h-full font-medium text-xs flex items-center justify-center">
        <li className="grow">
          <Link href="/budget" className="flex flex-col items-center h-full gap-[2px]">
            <HomeIcon
              className={
                pathname === '/budget' ? 'fill-lemonGreen-700' : 'fill-grayCaption'
              }
            />
            <span
              className={
                pathname === '/budget' ? 'text-lemonGreen-700' : 'text-grayCaption'
              }
            >
              Budget
            </span>
          </Link>
        </li>
        <li className="grow">
          <Link href="/track" className="flex flex-col items-center h-full gap-[2px]">
            <NoteIcon
              className={
                pathname === '/track' ? 'fill-lemonGreen-700' : 'fill-grayCaption'
              }
            />
            <span
              className={
                pathname === '/track' ? 'text-lemonGreen-700' : 'text-grayCaption'
              }
            >
              Track
            </span>
          </Link>
        </li>
        <li className="grow">
          <Link href="/analysis" className="flex flex-col items-center h-full gap-[2px]">
            <ChartIcon
              className={
                pathname === '/analysis' ? 'fill-lemonGreen-700' : 'fill-grayCaption'
              }
            />
            <span
              className={
                pathname === '/analysis' ? 'text-lemonGreen-700' : 'text-grayCaption'
              }
            >
              Analysis
            </span>
          </Link>
        </li>
        <li className="grow">
          <Link href="/profile" className="flex flex-col items-center h-full gap-[2px]">
            <UserIcon
              className={
                pathname === '/profile' ? 'fill-lemonGreen-700' : 'fill-grayCaption'
              }
            />
            <span
              className={
                pathname === '/profile' ? 'text-lemonGreen-700' : 'text-grayCaption'
              }
            >
              Profile
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
