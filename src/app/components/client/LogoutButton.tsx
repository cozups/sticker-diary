'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      className="bg-indigo-800 text-white rounded-lg px-2 py-1"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      로그아웃
    </button>
  );
}
