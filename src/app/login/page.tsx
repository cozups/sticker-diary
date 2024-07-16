'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  function onLogin() {
    signIn('google', { callbackUrl: '/' });
  }

  return (
    <div>
      <button onClick={onLogin}>Google 로그인</button>
    </div>
  );
}
