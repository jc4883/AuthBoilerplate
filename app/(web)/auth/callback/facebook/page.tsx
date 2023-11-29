'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const getHashParams = () => {
  const hash = window.location.hash.slice(1).split('&');
  const params = hash.reduce((params: Record<string, string>, param: string) => {
    const [key, value] = param.split('=');
    params[key] = value;
    return params;
  }, {});
  return params;
};

export default function FacebookLoginCallback() {
  const router = useRouter();
  const fetchCalled = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (fetchCalled.current) {
      return;
    }
    fetchCalled.current = true;

    const hashParams = getHashParams();
    if (hashParams.access_token == null || router == null) {
      return;
    }

    const callback = async () => {
      const res = await fetch('/api/auth/callback/facebook', {
        method: 'POST',
        body: JSON.stringify({
          accessToken: hashParams.access_token,
        }),
      });
      if (res.redirected === true) {
        router.replace(res.url);
      }
    };
    callback();
    // eslint-disable-next-line
  }, [router]);

  return null;
}
