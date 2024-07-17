'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Profile() {
  const { data: session } = useSession();

  return (
    <>
      <div className="rounded-full">
        <Image
          src={session?.user?.image || '/default_profile.png'}
          alt="profile"
          width={120}
          height={120}
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
    </>
  );
}
