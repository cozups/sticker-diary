'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <>
      <Link href="/" className="text-4xl font-black">
        덕질일기
      </Link>
      {session ? (
        <button onClick={() => signOut({ callbackUrl: '/' })}>로그아웃</button>
      ) : (
        <>
          <Link href={'/login'}>로그인</Link>
        </>
      )}
    </>
  );
}
