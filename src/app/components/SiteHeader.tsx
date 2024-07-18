'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export default function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-indigo-200">
      <Link href="/" className="text-4xl font-black">
        스티커 일기
      </Link>
      {status === 'authenticated' ? (
        <div className="flex gap-4">
          <Link
            className="flex items-center justify-center gap-2"
            href="/profile"
          >
            <div className="rounded-full w-8 h-8 overflow-hidden">
              <Image
                src={session.user?.image || '/default_profile.png'}
                alt="profile"
                width={120}
                height={120}
                className="w-auto h-full object-cover"
              />
            </div>
            <p className="font-semibold">{session.user?.name}</p>
          </Link>
          <button
            className="bg-indigo-800 text-white rounded-lg px-2 py-1"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Link
            className="bg-indigo-800 text-white rounded-lg px-2 py-1"
            href={'/login'}
          >
            로그인
          </Link>
          <Link
            className="bg-indigo-800 text-white rounded-lg px-2 py-1"
            href={'/join'}
          >
            회원가입
          </Link>
        </div>
      )}
    </header>
  );
}
