import React from 'react';
import clsx from 'clsx';
import { cn } from '@/app/(web)/common/lib/utils';

interface PropsIface {
  text: string;
  className?: string;
}

const FancyTextWithWrap = ({ text, className }: PropsIface) => {
  return (
    <span className='relative text-blue-600'>
      <span
        className={cn(
          'relative mb-3 bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-center font-extrabold tracking-tight text-transparent',
          className,
        )}
      >
        {text}
      </span>
    </span>
  );
};

export default FancyTextWithWrap;
