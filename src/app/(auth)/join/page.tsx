'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-1/4">
      <div className="flex flex-col my-2">
        <label htmlFor="username">Username</label>
        <input
          {...register('username', { required: true })}
          className={InputStyle}
        />
        {errors.username && <p>Username is required.</p>}
      </div>

      <div className="flex flex-col my-2">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className={InputStyle}
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>Email is required and must include @.</p>}
      </div>

      <div className="flex flex-col my-2">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className={InputStyle}
          {...register('password', { required: true, minLength: 6 })}
        />
        {errors.password && (
          <p>Password is required and must be at least 6 characters long.</p>
        )}
      </div>

      <div className="flex flex-col my-2">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          className={InputStyle}
          {...register('confirmPassword', {
            required: true,
            validate: (value) =>
              watch('password') === value || 'Passwords do not match.',
          })}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
}
