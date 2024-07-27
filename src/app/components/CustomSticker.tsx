import { auth } from '@/auth';
import Image from 'next/image';

export default async function CustomSticker() {
  const session = await auth();

  return (
    <div className="flex gap-10 text-center">
      <div>
        <Image
          src={session?.user?.stickers?.best || '/stickers/best.png'}
          width={96}
          height={96}
          alt="best"
        />
        <p className="font-semibold">최고!</p>
      </div>
      <div>
        <Image
          src={session?.user?.stickers?.good || '/stickers/good.png'}
          width={96}
          height={96}
          alt="good"
        />
        <p className="font-semibold">좋아!</p>
      </div>
      <div>
        <Image
          src={session?.user?.stickers?.soso || '/stickers/soso.png'}
          width={96}
          height={96}
          alt="soso"
        />
        <p className="font-semibold">그냥저냥</p>
      </div>
      <div>
        <Image
          src={session?.user?.stickers?.bad || '/stickers/bad.png'}
          width={96}
          height={96}
          alt="bad"
        />
        <p className="font-semibold">별로...</p>
      </div>
      <div>
        <Image
          src={session?.user?.stickers?.worst || '/stickers/worst.png'}
          width={96}
          height={96}
          alt="worst"
        />
        <p className="font-semibold">최악!</p>
      </div>
    </div>
  );
}
