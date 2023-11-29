import FancyTextWithWrap from '@/app/(web)/common/components/FancyTextWithWrap';
import LoginButton from './LoginButton';

export default function Hero() {
  return (
    <div className='grid items-center justify-center text-center'>
      <div className='col-span-1'>
        <h1 className='mx-auto max-w-2xl font-display text-5xl sm:text-7xl font-medium tracking-tight text-slate-900'>
          {'Convert Instagram'}
          <br />
          {'followers to'}
          <br />
          <FancyTextWithWrap text='Email Subscribers' className='from-purple-600 to-rose-600' />
        </h1>
        <p className='mx-auto mt-6 max-w-5xl text-xl sm:text-2xl tracking-tight text-slate-700'>
          {`Nove grows your email list so you can make more sales.`}
          <br />
          {'We are an approved Meta Messenger API developer.'}
        </p>
        <div className='mt-10 flex justify-center gap-x-6'>
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
