'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { dateState } from '@/app/states';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/app/utils';
import { Schedule } from '@/app/types';
import StyledInput from '@/app/components/UI/StyledInput';
import Button from '@/app/components/UI/Button';

export default function ScheduleForm() {
  const date = useRecoilValue(dateState);
  const { register, handleSubmit } = useForm<Schedule>();
  const router = useRouter();

  const onSubmit: SubmitHandler<Schedule> = async (data: Schedule) => {
    if (data.title === '') {
      return;
    }

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-auto bg-white shadow rounded-xl"
    >
      <h1 className="text-2xl font-bold text-center my-4">스케줄 추가하기</h1>
      <div className="px-16 pt-4 pb-8">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-gray-400 my-2">
            스케줄명
          </label>
          <StyledInput type="text" {...register('title')} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="text-gray-400 my-2">
            설명
          </label>
          <textarea
            id="description"
            rows={4}
            className="px-2 py-1 border-b-2 border-indigo-700 border-opacity-30 resize-none"
            {...register('description')}
          />
        </div>
        <Button
          customStyle="bg-gray-100 w-full mt-8 hover:bg-gray-200 transition-color ease-in duration-100"
          type="submit"
        >
          추가
        </Button>
      </div>
    </form>
  );
}
