import { aeonik } from '@/fonts';
import { NextUIProvider } from '@nextui-org/system';
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
        <link rel="icon" sizes="" href="/icon.ico?e17e014ad5625454" />
      </Head>
      <body className="font-aeonik bg-white flex justify-center min-h-screen">
        <NextUIProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <Providers>
            <div className="w-[100vw] font-aeonik max-w-[500px] bg-white">{children}</div>
          </Providers>
        </NextUIProvider>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W9FRXW3P');`}
        </Script>
        <Script id="tawk-script" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/6776d57f49e2fd8dfe01c226/1igk33vbd';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>

        {/* <!-- Google tag (gtag.js) --> */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PJ5CK088G0"
          strategy="afterInteractive"
        ></Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PJ5CK088G0');
          `}
        </Script>
      </body>
    </html>
  );
}
