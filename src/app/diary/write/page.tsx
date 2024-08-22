'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Diary } from '@/app/types';
import { useRecoilValue } from 'recoil';
import { dateState } from '@/app/states';
import { base64ToFile, formatDate } from '@/app/utils';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/app/components/diary/Editor'), {
  loading: () => <div>Loading Editor...</div>,
  ssr: false,
});

export default function WriteDiary() {
  const { register, handleSubmit } = useForm<Diary>();
  const date = useRecoilValue(dateState);
  const [content, setContent] = useState('');
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);

  const onSubmit: SubmitHandler<Diary> = async (data: Diary) => {
    if (previewRef.current) {
      const imageNodes: NodeListOf<HTMLImageElement> =
        previewRef.current.querySelectorAll('img');
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
      data.contents = previewRef.current.innerHTML;
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
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center"
    >
      <div className="mb-1">
        <label
          htmlFor="title"
          className="text-lg font-bold mr-2 bg-indigo-500 bg-opacity-20 px-1"
        >
          제목
        </label>
        <input
          type="text"
          {...register('title')}
          className="border rounded px-1"
        />
      </div>
      <div className="mb-1">
        <label
          htmlFor="expression"
          className="text-lg font-bold mr-2 bg-indigo-500 bg-opacity-20 px-1"
        >
          기분
        </label>
        <select
          id="expression"
          {...register('expression')}
          className="border rounded"
        >
          <option value="best">최고!</option>
          <option value="good">좋아!</option>
          <option value="soso">그냥저냥</option>
          <option value="bad">별로...</option>
          <option value="worst">최악!</option>
        </select>
      </div>
      <Editor value={content} onChange={setContent} />
      <button
        type="submit"
        className="cursor-pointer rounded px-2 py-1 bg-indigo-800 text-white w-fit mt-4 self-center"
      >
        작성
      </button>
      <div id="preview" className="hidden" ref={previewRef}></div>
    </form>
  );
}
