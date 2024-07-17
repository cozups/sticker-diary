'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const { data: session } = useSession();
  const router = useRouter();
  if (session) {
    router.push('/dashboard');
  }

  return <div>Landing</div>;
}
