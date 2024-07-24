'use client';

import StickerInput from '@components/StickerInput';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EditSticker() {
  const { data: session, update } = useSession();
  const [stickers, setStickers] = useState<Record<string, File>>({});
  const router = useRouter();

  const onSubmit = async () => {
    const formData = new FormData();

    Object.entries(stickers).map(([key, file]) => {
      formData.append(key, file);
    });

    formData.append('email', session?.user!.email as string);

    const response = await fetch('/api/images?target=stickers', {
      method: 'POST',
      body: formData,
    });

    const updatedStickers = await response.json();

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        stickers: updatedStickers,
      },
    };

    await update(newSession);

    router.replace('/profile');
  };

  return (
    <div>
      <h1 className="font-bold text-2xl">스티커 수정하기</h1>
      <StickerInput
        src={session?.user?.stickers?.best || '/stickers/best.png'}
        alt="best"
        title="최고!"
        onChange={setStickers}
      />
      <StickerInput
        src={session?.user?.stickers?.good || '/stickers/good.png'}
        alt="good"
        title="좋아!"
        onChange={setStickers}
      />
      <StickerInput
        src={session?.user?.stickers?.soso || '/stickers/soso.png'}
        alt="soso"
        title="그냥저냥"
        onChange={setStickers}
      />
      <StickerInput
        src={session?.user?.stickers?.bad || '/stickers/bad.png'}
        alt="bad"
        title="별로..."
        onChange={setStickers}
      />
      <StickerInput
        src={session?.user?.stickers?.worst || '/stickers/worst.png'}
        alt="worst"
        title="최악!"
        onChange={setStickers}
      />
      <button onClick={onSubmit}>수정하기</button>
    </div>
  );
}
