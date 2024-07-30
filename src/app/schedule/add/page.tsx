'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { dateState } from '@/app/states';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/app/utils';
import { Schedule } from '@/app/types';

export default function ScheduleForm() {
  const date = useRecoilValue(dateState);
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
        date: new Date(formatDate(date.selectedDate)),
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
