'use client';

import { SubmitHandler, useForm } from 'react-hook-form';

interface Diary {
  title: string;
  contents: string;
}

export default function WriteDiary() {
  const { register, handleSubmit } = useForm<Diary>();

  const onSubmit: SubmitHandler<Diary> = async (data: Diary) => {
    console.log(data);

    const response = await fetch('/api/diary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: new Date(),
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
