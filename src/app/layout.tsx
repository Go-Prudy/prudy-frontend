import { aeonik } from '@/fonts';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${aeonik.variable} h-full`}>
      <body className="font-aeonik">
        <div className="max-w-[400px] mx-auto">
          <main className="flex min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}
