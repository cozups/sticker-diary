'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Diary } from '@/app/types';
import { useRecoilValue } from 'recoil';
import { dateState } from '@/app/states';
import { formatDate } from '@/app/utils';

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
        ...data,
        date: new Date(formatDate(date)),
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
        <label htmlFor="expression">기분</label>
        <select id="expression" {...register('expression')}>
          <option value="best">최고!</option>
          <option value="good">좋아!</option>
          <option value="soso">그냥저냥</option>
          <option value="bad">별로...</option>
          <option value="worst">최악!</option>
        </select>
      </div>
      <div>
        <label htmlFor="contents">내용</label>
        <textarea {...register('contents')} className="border" />
      </div>
      <button type="submit">작성</button>
    </form>
  );
}
