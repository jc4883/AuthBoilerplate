import { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/app/(web)/common/lib/utils';
import { cookies } from 'next/headers';
import { AppCookie } from '@/app/(service)/constants/appCookie';
import { GetServerSideProps } from 'next';
import { redirect } from 'next/navigation';
import * as AccessTokenClient from '@/app/(service)/clients/accessToken';
import { headers } from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nove',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const PUBLIC_ROUTES = [
  '/',
  '/legal/privacy',
  '/legal/terms-and-conditions',
  '/auth/callback/facebook',
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userIdCookie = cookies().get(AppCookie.UserId);
  const accessTokenCookie = cookies().get(AppCookie.UserAccessToken);

  const userId = userIdCookie?.value;
  const accessToken = accessTokenCookie?.value;

  const headersList = headers();
  const headerUrl = headersList.get('x-url-pathname') || '/';

  if (!PUBLIC_ROUTES.some((route) => route === headerUrl)) {
    if (userId == null || accessToken == null) {
      return redirect('/');
    }
    const valid = await AccessTokenClient.check({
      accessToken,
      userId,
    });
    if (!valid) {
      return redirect('/');
    }
  }

  return (
    <html lang='en'>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        {children}
      </body>
    </html>
  );
}
