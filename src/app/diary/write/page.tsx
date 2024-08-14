'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Diary } from '@/app/types';
import { useRecoilValue } from 'recoil';
import { dateState } from '@/app/states';
import { base64ToFile, formatDate } from '@/app/utils';
import Editor from '@/app/components/diary/Editor';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WriteDiary() {
  const { register, handleSubmit } = useForm<Diary>();
  const date = useRecoilValue(dateState);
  const [content, setContent] = useState('');
  const router = useRouter();

  const onSubmit: SubmitHandler<Diary> = async (data: Diary) => {
    const imageNodes: NodeListOf<HTMLImageElement> =
      document.querySelectorAll('#preview img');
    const imageSrcs = Array.from(imageNodes, (img) => img.src);
    const imageFiles = imageSrcs.map((src) => base64ToFile(src, 'file'));

    await Promise.all(
      imageFiles.map(async (img, index) => {
        const formData = new FormData();
        formData.append('file', img);
        const response = await fetch('/api/images?target=image', {
          method: 'POST',
          body: formData,
        });

        const { url } = await response.json();

        imageNodes[index].src = url;
      })
    );

    data.contents = document.getElementById('preview')!.innerHTML;

    const response = await fetch('/api/diary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        date: new Date(formatDate(date.selectedDate)),
      }),
    });

    router.push('/dashboard');
  };

  return (
    <div>
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
        <Editor value={content} onChange={setContent} />
        <button type="submit">작성</button>
        <div id="preview" className="hidden"></div>
      </form>
    </div>
  );
}
