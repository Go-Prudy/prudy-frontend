import { aeonik } from '@/fonts';
import { NextUIProvider } from "@nextui-org/system";
import './globals.css';
import Head from 'next/head';
import Script from 'next/script';
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
      <body className="font-aeonik bg-white flex justify-center min-h-screen">
        <NextUIProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <Providers>
            <div className="w-[100vw] font-aeonik max-w-[500px] bg-white">
              {children}

            </div>
          </Providers>
        </NextUIProvider>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W9FRXW3P');`}
        </Script>
      </body>
    </html>
  );
}