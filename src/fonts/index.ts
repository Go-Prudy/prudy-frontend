import localFont from 'next/font/local';

export const aeonik = localFont({
  display: 'swap',
  variable: '--font-aeonik',
  src: [
    {
      path: './aeonik/Aeonik-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './aeonik/Aeonik-Bold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
});
