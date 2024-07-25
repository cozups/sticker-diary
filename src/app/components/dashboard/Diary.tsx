'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Diary() {
  const [diary, setDiary] = useState();

  return (
    <div className="h-full">
      <h1 className="font-bold text-center pt-3 pb-1 text-xl ">Diary</h1>
      {diary ? (
        <div></div>
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
