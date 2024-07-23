import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import SiteHeader from '@components/SiteHeader';
import SiteFooter from '@components/SiteFooter';
import SessionWrapper from '@components/wrapper/SessionWrapper';
import RecoilWrapper from '@components/wrapper/RecoilWrapper';

const notoSansKR = Noto_Sans_KR({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '스티커 일기',
  description: '스티커 일기를 써봅시다',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={notoSansKR.className}>
        <SessionWrapper>
          <RecoilWrapper>
            <SiteHeader />
            <div className="rounded-xl h-screen mx-8">{children}</div>
            <SiteFooter />
          </RecoilWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
