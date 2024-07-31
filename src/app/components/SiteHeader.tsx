import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import LogoutButton from './client/LogoutButton';
import RoundImage from './UI/RoundImage';

export default async function SiteHeader() {
  const session = await auth();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-indigo-200 flex-none">
      <Link href="/" className="text-4xl font-black">
        스티커 일기
      </Link>
      {session ? (
        <div className="flex gap-4">
          <Link
            className="flex items-center justify-center gap-2"
            href="/profile"
          >
            <RoundImage
              src={session.user?.image || '/default_profile.png'}
              alt="profile"
              width={120}
              height={120}
            />
            <p className="font-semibold">{session.user?.name}</p>
          </Link>
          <LogoutButton />
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
