'use client';

import Button from '@/app/components/UI/Button';
import StyledInput from '@/app/components/UI/StyledInput';
import { Schedule } from '@/app/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

function EditSchedule() {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-auto bg-white shadow rounded-xl"
    >
      <h1 className="text-2xl font-bold text-center my-4">스케줄 수정하기</h1>
      <div className="px-16 pt-4 pb-8">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-gray-400 my-2">
            스케줄명
          </label>
          <StyledInput id="title" type="text" {...register('title')} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="text-gray-400 my-2">
            설명
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="py-1 border-b-2 border-indigo-700 border-opacity-30 resize-none"
          />
        </div>
        <Button
          type="submit"
          customStyle="bg-gray-100 w-full mt-8 hover:bg-gray-200 transition-color ease-in duration-100"
        >
          수정
        </Button>
      </div>
    </form>
  );
}

export default function EditSchedulePage() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <EditSchedule />
    </Suspense>
  );
}
