'use client';

import { Diary } from '@/app/types';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function EditDiary() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { register, handleSubmit, setValue } = useForm<Diary>();

  useEffect(() => {
    const fetchDiary = async () => {
      const response = await fetch(`/api/diary?id=${id}`);
      const diary = await response.json();

      if (diary) {
        setValue('title', diary.title);
        setValue('expression', diary.expression);
        setValue('contents', diary.contents);
      }
    };

    fetchDiary();
  }, [id, setValue]);

  const onSubmit = async (data: Diary) => {
    const response = await fetch('/api/diary', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, id }),
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
