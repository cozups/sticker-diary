'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Profile() {
  const { data: session } = useSession();

  return (
    <>
      <div className="border w-full flex flex-col items-center py-8 rounded-xl">
        <div className="rounded-full w-32 h-32 overflow-hidden">
          <Image
            src={session?.user?.image || '/default_profile.png'}
            alt="profile"
            width={500}
            height={500}
            className="w-auto h-full object-cover"
          />
        </div>
        <div className="my-4 text-center">
          <h1 className="font-bold text-3xl">{session?.user?.name}</h1>
          <h2 className="text-gray-500">{session?.user?.email}</h2>
        </div>
        <Link
          href={'/profile/edit'}
          className="bg-indigo-800 text-white px-2 py-1 rounded-lg"
        >
          수정하기
        </Link>
      </div>
      <div className="border mt-8 w-full flex flex-col items-center">
        {/* sticker */}
        <h1>내 스티커</h1>
      </div>
    </>
  );
}
