import Image from 'next/image';

export default function CustomSticker() {
  return (
    <div className="flex gap-10 text-center">
      <div>
        <Image src={'/stickers/best.png'} width={96} height={96} alt="best" />
        <p className="font-semibold">최고!</p>
      </div>
      <div>
        <Image src={'/stickers/good.png'} width={96} height={96} alt="good" />
        <p className="font-semibold">좋아!</p>
      </div>
      <div>
        <Image src={'/stickers/soso.png'} width={96} height={96} alt="soso" />
        <p className="font-semibold">그냥저냥</p>
      </div>
      <div>
        <Image src={'/stickers/bad.png'} width={96} height={96} alt="bad" />
        <p className="font-semibold">별로...</p>
      </div>
      <div>
        <Image src={'/stickers/worst.png'} width={96} height={96} alt="worst" />
        <p className="font-semibold">최악!</p>
      </div>
    </div>
  );
}
