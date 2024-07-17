'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

export default function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="text-4xl font-black">
        스티커 일기
      </Link>
      {status === 'authenticated' ? (
        <div className="flex">
          <Link href="/profile">
            <Image
              src={session.user?.image || '/default_profile.png'}
              alt="profile"
              width={30}
              height={30}
            />
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/' })}>
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex">
          <Link href={'/login'}>로그인</Link>
          <Link href={'/join'}>회원가입</Link>
        </div>
      )}
    </header>
  );
}
