'use client';

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Landing() {
  const { data: session } = useSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-6xl font-black">스티커 일기</h1>
      <h2 className="text-gray-600 text-xl my-4">
        특별했던 날의 기분을 나만의 스티커로 남겨보아요!
      </h2>
    </div>
  );
}
