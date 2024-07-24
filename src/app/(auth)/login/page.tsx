'use client';

import { signIn } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface LoginFormInput {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>();

  const onSubmit: SubmitHandler<LoginFormInput> = async (
    data: LoginFormInput
  ) => {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl: '/',
    });

    // if (res?.error) {
    //   // login failed.
    //   console.error(res.error);
    // }
  };

  const onGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-1/4">
        <div className="flex flex-col">
          <label htmlFor="email">ID</label>
          <input
            id="email"
            {...register('email', { required: true })}
            className="border"
          />
          {errors.email && <p>이메일을 입력하세요.</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: true })}
            className="border"
          />
          {errors.password && <p>비밀번호를 입력하세요.</p>}
        </div>

        <button type="submit">로그인</button>
      </form>
      <button onClick={onGoogleLogin}>Google 로그인</button>
    </div>
  );
}
