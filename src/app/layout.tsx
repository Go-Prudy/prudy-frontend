import { aeonik } from '@/fonts';
import { NextUIProvider } from "@nextui-org/system";
import './globals.css';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';
import Providers from './ReactQueryProvider';

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
          <Toaster
            position="top-right"
            reverseOrder={false}
          />
          <Providers>
            {children}
          </Providers>
        </NextUIProvider>

      </body>
    </html>
  );
}