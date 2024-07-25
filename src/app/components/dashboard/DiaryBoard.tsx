'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { dateState, diaryState } from '@/app/states';
import { format, isSameDay } from 'date-fns';
import { Diary } from '@/app/types';
import { formatDate } from '@/app/utils';

export default function DiaryBoard() {
  const [diary, setDiary] = useState<Diary | null>(null);
  const date = useRecoilValue(dateState);
  const diaries = useRecoilValue(diaryState);

  useEffect(() => {
    const diaryOfToday = diaries.filter((diary) => isSameDay(diary.date, date));
    setDiary(diaryOfToday[0]);
  }, [date, diaries]);

  return (
    <div className="h-full">
      <h1 className="font-bold text-center pt-3 pb-1 text-xl ">Diary</h1>
      {diary ? (
        <div>
          <h1 className="text-lg font-semibold">{diary.title}</h1>
          <p className="text-sm text-gray-500">{formatDate(diary.date)}</p>
          <div>
            <p>{diary.contents}</p>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-center items-center">
          <Link href="/diary/write" className="shadow px-2 py-1 rounded">
            일기 쓰기
          </Link>
        </div>
      )}
    </div>
  );
}
