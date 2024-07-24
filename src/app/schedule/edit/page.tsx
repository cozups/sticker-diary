'use client';

import { Schedule } from '@/app/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function EditSchedule() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [schedule, setSchedule] = useState<Schedule>();
  const { register, handleSubmit, setValue } = useForm<Schedule>();
  const router = useRouter();

  useEffect(() => {
    const fetchSchedule = async (id: string) => {
      const response = await fetch(`/api/schedules?id=${id}`);

      const found = await response.json();

      if (found) {
        setValue('title', found.title);
        setValue('description', found.description);
        setSchedule(found);
      }
    };

    if (id) {
      fetchSchedule(id);
    }
  }, [id, setValue]);

  const onSubmit: SubmitHandler<Schedule> = async (data: Schedule) => {
    const response = await fetch('/api/schedules', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        id,
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
      <button type="submit">수정</button>
    </form>
  );
}
