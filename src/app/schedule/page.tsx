'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { dateState } from '../states';
import { formatDate } from '../utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Schedule {
  title: string;
  description: string;
}

export default function ScheduleForm() {
  const [date] = useRecoilState(dateState);
  const { data: session } = useSession();
  const { register, handleSubmit } = useForm<Schedule>();
  const router = useRouter();

  const onSubmit: SubmitHandler<Schedule> = async (data: Schedule) => {
    const response = await fetch('/api/schedules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        date: date,
      }),
    });

    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" {...register('title')} />
      </div>
      <div>
        <label htmlFor="description">설명</label>
        <input type="text" {...register('description')} />
      </div>
      <button type="submit">추가</button>
    </form>
  );
}
