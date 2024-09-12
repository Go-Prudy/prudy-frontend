import { aeonik } from '@/fonts';
import { NextUIProvider } from "@nextui-org/system";
import './globals.css';
import Head from 'next/head';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${aeonik.variable}`}>
      <Head>
        <link rel='icon' sizes='' href='/icon.ico?e17e014ad5625454' />
      </Head>
      <body className="font-aeonik">
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}