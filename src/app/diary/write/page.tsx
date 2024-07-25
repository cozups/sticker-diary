'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Diary } from '@/app/types';
import { useRecoilValue } from 'recoil';
import { dateState } from '@/app/states';

export default function WriteDiary() {
  const { register, handleSubmit } = useForm<Diary>();
  const date = useRecoilValue(dateState);

  const onSubmit: SubmitHandler<Diary> = async (data: Diary) => {
    const response = await fetch('/api/diary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date,
        ...data,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">제목</label>
        <input type="text" {...register('title')} className="border" />
      </div>
      <div>
        <label htmlFor="contents">내용</label>
        <textarea {...register('contents')} className="border" />
      </div>
      <button type="submit">작성</button>
    </form>
  );
}
