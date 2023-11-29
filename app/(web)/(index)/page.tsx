import Link from 'next/link';
import Hero from '@/app/(web)/(index)/components/Hero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nove: Increase DTC Sales',
};

export default function Home() {
  return (
    <main className='flex justify-center items-center h-screen'>
      <Hero />
      <div className='fixed bottom-0 left-0 w-full bg-primary flex justify-center gap-x-8 px-4 py-2'>
        <Link href='/legal/terms-and-conditions'>
          <span className='text-white font-bold text-sm underline'>{'Terms'}</span>
        </Link>
        <Link href='/legal/privacy'>
          <span className='text-white font-bold text-sm underline'>{'Privacy'}</span>
        </Link>
      </div>
    </main>
  );
}
