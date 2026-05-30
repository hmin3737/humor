import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '분위기도 위기다',
  description: '~~도 ~~다. 식의 유머를 친구들과 함께 모으는 곳',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
