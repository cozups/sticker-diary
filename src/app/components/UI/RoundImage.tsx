import Image from 'next/image';
import { RefObject } from 'react';

interface RoundImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  ref?: RefObject<HTMLImageElement>;
}

export default function RoundImage({
  src,
  alt,
  width,
  height,
}: RoundImageProps) {
  const calculateStyleSize = (width: number, height: number) => {
    if (width >= 300 || height >= 300) {
      return 'w-32 h-32';
    }
    if (width >= 150 || height >= 150) {
      return 'w-16 h-16';
    }

    return 'w-8 h-8';
  };

  return (
    <div
      className={`rounded-full overflow-hidden ${calculateStyleSize(
        width,
        height
      )}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
