'use client';

import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function DeleteProfile() {
  const router = useRouter();
  const { data: session } = useSession();

  const onClickYes = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // delete user
    const response = await fetch('/api/profile', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session?.user?.email || '',
      }),
    });

    // delete user image
    const deleteImageResponse = await fetch('/api/images', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: session?.user?.image,
      }),
    });

    // delete session
    signOut();

    router.replace('/profile/delete/done');
  };
  const onClickNo = (e: React.MouseEvent<HTMLButtonElement>) => {
    router.back();
  };

  return (
    <div>
      <h1>정말로 탈퇴하시겠습니까?</h1>
      <button onClick={onClickYes}>네</button>
      <button onClick={onClickNo}>아니오</button>
    </div>
  );
}
