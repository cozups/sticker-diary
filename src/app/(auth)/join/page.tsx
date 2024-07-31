'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import StyledInput from '@/app/components/UI/StyledInput';
import Button from '@/app/components/UI/Button';

interface FormInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const InputStyle = 'border';

export default function Join() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async (data: FormInput) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      router.push('/login');
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <h1 className="text-center text-2xl font-bold mb-8 py-8 w-full text-indigo-700">
        회원 가입
      </h1>
      <div className="px-16 mb-2 flex flex-col justify-center items-center">
        <div className="flex flex-col w-full mb-3">
          <label className="text-gray-400" htmlFor="username">
            Username
          </label>
          <StyledInput
            id="username"
            {...register('username', { required: true })}
          />
          {errors.username && <p>Username is required.</p>}
        </div>

        <div className="flex flex-col my-3 w-full">
          <label className="text-gray-400" htmlFor="email">
            Email
          </label>
          <StyledInput
            id="email"
            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
          />
          {errors.email && <p>Email is required and must include @.</p>}
        </div>

        <div className="flex flex-col my-3 w-full">
          <label className="text-gray-400" htmlFor="password">
            Password
          </label>
          <StyledInput
            id="password"
            type="password"
            {...register('password', { required: true, minLength: 6 })}
          />
          {errors.password && (
            <p>Password is required and must be at least 6 characters long.</p>
          )}
        </div>

        <div className="flex flex-col mt-3 mb-6 w-full">
          <label className="text-gray-400" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <StyledInput
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', {
              required: true,
              validate: (value) =>
                watch('password') === value || 'Passwords do not match.',
            })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>

        <Button
          customStyle="bg-gray-100 w-full hover:bg-gray-200 transition-color ease-in duration-100"
          type="submit"
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
}
