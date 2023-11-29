'use client';

import React from 'react';
import { Button } from '@/app/(web)/common/components/button';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const router = useRouter();

  const onClick = React.useCallback(async () => {
    const loginRes = await fetch('/api/auth/login');
    const loginJson = await loginRes.json();
    const redirectUrl = loginJson.url;
    if (redirectUrl != null) {
      router.push(redirectUrl);
    }
  }, [router]);

  return (
    <Button onClick={onClick}>
      {'Login with Facebook'}
      <ArrowRightIcon className='ml-2 h-4' />
    </Button>
  );
}
