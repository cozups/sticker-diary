'use client';

import Button from '@/app/components/UI/Button';
import StyledInput from '@/app/components/UI/StyledInput';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormInput> = async (
    data: LoginFormInput
  ) => {
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      if (res && res.url) {
        router.replace(res.url);
      }
    } catch (error) {
      alert('로그인에 실패했습니다. 이메일/패스워드를 정확하게 입력해주세요.');
    }
  };

  const onGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="flex flex-col items-center justify-center px-16">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <h1 className="text-center text-2xl font-bold mb-8 py-8 w-full text-indigo-700">
          로그인
        </h1>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col w-full mb-3">
            <label className="text-gray-400" htmlFor="email">
              Email
            </label>
            <StyledInput
              id="email"
              {...register('email', { required: true })}
            />
            {errors.email && <p>이메일을 입력하세요.</p>}
          </div>

          <div className="flex flex-col w-full mt-3 mb-6">
            <label className="text-gray-400" htmlFor="password">
              Password
            </label>
            <StyledInput
              id="password"
              type="password"
              {...register('password', { required: true })}
            />
            {errors.password && <p>비밀번호를 입력하세요.</p>}
          </div>

          <Button
            customStyle="bg-gray-100 w-full hover:bg-gray-200 transition-color ease-in duration-100"
            type="submit"
          >
            로그인
          </Button>
        </div>
      </form>

      <div className="w-1/2 h-0 border-b my-8"></div>

      <Button
        customStyle="bg-blue-800 text-white w-full hover:bg-blue-900 transition-color ease-in duration-100"
        onClick={onGoogleLogin}
      >
        Google 로그인
      </Button>
    </div>
  );
}
