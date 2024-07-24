'use client';

import { useRouter } from 'next/navigation';

export default function ClientButtons({ id }: { id: string }) {
  const router = useRouter();
  const onClickModify = async () => {};
  const onClickDelete = async () => {
    const response = await fetch('/api/schedules', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    router.replace('/');
  };

  return (
    <div className="mb-4">
      <button
        className="bg-blue-800 text-white px-2 py-1 rounded-lg mr-1"
        onClick={onClickModify}
      >
        수정
      </button>
      <button
        className="bg-red-700 text-white px-2 py-1 rounded-lg"
        onClick={onClickDelete}
      >
        삭제
      </button>
    </div>
  );
}
