'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

interface EditFormInput {
  image?: string;
  username: string;
}

export default function Edit() {
  const { data: session, update } = useSession();
  const { register, handleSubmit } = useForm<EditFormInput>();
  const router = useRouter();

  const onSubmit: SubmitHandler<EditFormInput> = async (
    data: EditFormInput
  ) => {
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        email: session?.user?.email,
      }),
    });

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: data.username,
        image: data.image,
      },
    };

    await update(newSession);

    router.push('/');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center"
    >
      <div>
        <Image
          src={session?.user?.image || '/default_profile.png'}
          alt="profile"
          width={120}
          height={120}
        />
      </div>

      <div className="flex flex-col justify-center items-start">
        <label htmlFor="username" className="font-bold">
          이름
        </label>
        <input
          id="username"
          className="border"
          {...register('username', { value: session?.user?.name || '' })}
        />
      </div>

      <button
        type="submit"
        className="bg-indigo-800 text-white px-2 py-1 rounded-lg"
      >
        수정하기
      </button>
    </form>
  );
}
