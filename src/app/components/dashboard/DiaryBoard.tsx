'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { dateState, diaryState } from '@/app/states';
import { Diary } from '@/app/types';
import { formatDate } from '@/app/utils';
import { useSession } from 'next-auth/react';
import RoundImage from '../UI/RoundImage';

export default function DiaryBoard() {
  const [diary, setDiary] = useState<Diary | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const { selectedDate } = useRecoilValue(dateState);
  const diaries = useRecoilValue(diaryState);
  const { data: session } = useSession();
  useEffect(() => {
    if (diaries) {
      const diaryOfToday = diaries.get(formatDate(selectedDate)) || null;
      setDiary(diaryOfToday);

      if (diaryOfToday) {
        // find image source
        const parser = new DOMParser();
        const doc = parser.parseFromString(diaryOfToday.contents, 'text/html');
        const imageNodes: NodeListOf<HTMLImageElement> =
          doc.querySelectorAll('img');
        setImages(Array.from(imageNodes, (img) => img.src));
      }
    }
  }, [selectedDate, diaries]);

  const onClickDelete = async () => {
    await Promise.all(
      images.map(async (img) => {
        await fetch('/api/images', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: img,
          }),
        });
      })
    );

    const response = await fetch('/api/diary', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: diary?.id }),
    });

    window.location.reload();
  };

  return (
    <div className="h-full flex flex-col">
      <div>
        <h1 className="font-bold text-center pt-3 pb-1 text-xl ">Diary</h1>
        <p className="text-sm text-gray-500 text-center mb-4">
          {formatDate(selectedDate)}
        </p>
      </div>
      {diary ? (
        <div className="border rounded-lg overflow-hidden mx-2 flex flex-col items-center justify-center">
          <div className="flex justify-between items-center py-4 px-2 bg-orange-50 w-full">
            <h1 className="text-lg font-semibold">{diary.title}</h1>
            <div className="flex gap-1 shadow w-fit px-2 py-1 rounded-lg bg-white items-center">
              <RoundImage
                src={
                  session?.user?.stickers
                    ? session?.user?.stickers[diary.expression]
                    : `/stickers/${diary.expression}.png`
                }
                width={25}
                height={25}
                alt="expression"
              />
              <span>{diary.expression}</span>
            </div>
          </div>
          <div
            className="h-full px-1 py-2 self-start"
            dangerouslySetInnerHTML={{ __html: diary.contents }}
          ></div>
          <div className="py-2">
            <Link
              href={`/diary/edit?id=${diary.id}`}
              className="bg-blue-800 text-white px-2 py-1 rounded-lg mr-1"
            >
              수정
            </Link>
            <button
              onClick={onClickDelete}
              className="bg-red-800 text-white px-2 py-1 rounded-lg mr-1"
            >
              삭제
            </button>
          </div>
        </div>
      ) : (
        <div className="grow flex flex-col justify-center items-center">
          <p className="font-semibold mb-2">일기가 없습니다.</p>
          <Link href="/diary/write" className="shadow px-2 py-1 rounded">
            일기 쓰기
          </Link>
        </div>
      )}
    </div>
  );
}
