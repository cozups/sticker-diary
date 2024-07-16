'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function SiteHeader() {
  const { data: session, status } = useSession();

  console.log(session);

  return (
    <div className="flex items-center">
      <Link href="/" className="text-4xl font-black">
        스티커 일기
      </Link>
      {session ? (
        <>
          <div>{session.user?.name}</div>
          <button onClick={() => signOut({ callbackUrl: '/' })}>
            로그아웃
          </button>
        </>
      ) : (
        <>
          <Link href={'/login'}>로그인</Link>
        </>
      )}
    </div>
  );
}
