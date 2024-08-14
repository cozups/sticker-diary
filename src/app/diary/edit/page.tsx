'use client';

import Editor from '@/app/components/diary/Editor';
import { Diary } from '@/app/types';
import { base64ToFile } from '@/app/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function EditDiary() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { register, handleSubmit, setValue } = useForm<Diary>();
  const [contents, setContents] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDiary = async () => {
      const response = await fetch(`/api/diary?id=${id}`);
      const diary = await response.json();

      if (diary) {
        setValue('title', diary.title);
        setValue('expression', diary.expression);
        setContents(diary.contents);

        // find image source
        const parser = new DOMParser();
        const doc = parser.parseFromString(diary.contents, 'text/html');
        const imageNodes: NodeListOf<HTMLImageElement> =
          doc.querySelectorAll('img');
        setImages(Array.from(imageNodes, (img) => img.src));
      }
    };

    fetchDiary();
  }, [id, setValue]);

  const onSubmit = async (data: Diary) => {
    const imageNodes: NodeListOf<HTMLImageElement> =
      document.querySelectorAll('#preview img');
    const imageSrcs = Array.from(imageNodes, (img) => img.src);

    // find deleted or added images
    const deletedImages = images.filter((src) => !imageSrcs.includes(src));
    const addedImages = imageSrcs.filter((src) => !images.includes(src));

    // delete old images
    await Promise.all(
      deletedImages.map(async (src) => {
        await fetch('/api/images', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: src,
          }),
        });
      })
    );

    // add new images
    await Promise.all(
      addedImages.map(async (src) => {
        const formData = new FormData();
        formData.append('file', base64ToFile(src, 'file'));
        const response = await fetch('/api/images?target=image', {
          method: 'POST',
          body: formData,
        });

        const { url } = await response.json();
        const index = imageSrcs.findIndex((imgSrc) => imgSrc === src);

        imageNodes[index].src = url;
      })
    );

    data.contents = document.getElementById('preview')!.innerHTML;

    const response = await fetch('/api/diary', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, id }),
    });

    router.push('/dashboard');
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
      <Editor value={contents} onChange={setContents} />

      <button type="submit">작성</button>
      <div id="preview" className="hidden"></div>
    </form>
  );
}
