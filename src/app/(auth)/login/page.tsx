'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

interface FormInput {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm();

  function onLogin() {
    signIn('google', { callbackUrl: '/' });
  }

  return (
    <div>
      <form on></form>
      <button onClick={onLogin}>Google 로그인</button>
    </div>
  );
}
