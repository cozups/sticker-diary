import Image from 'next/image';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import RoundImage from './UI/RoundImage';

interface StickerInputProps {
  title: string;
  src: string;
  alt: string;
  onChange: Dispatch<SetStateAction<Record<string, File>>>;
}

export default function StickerInput({
  title,
  src,
  alt,
  onChange: setStickers,
}: StickerInputProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeInput = () => {
    if (!inputRef.current || !inputRef.current.files?.length) return;

    const imageFile = inputRef.current.files[0];
    const previewURL = URL.createObjectURL(imageFile);

    setImageSrc(previewURL);
    setStickers((prev) => ({ ...prev, [inputRef.current!.name]: imageFile }));
  };

  return (
    <div className="flex flex-col items-center justify-center shadow rounded-xl py-8">
      <div>
        <RoundImage src={imageSrc} width={300} height={300} alt={alt} />
        <p className="font-semibold text-center my-2">{title}</p>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={onChangeInput}
        ref={inputRef}
        name={alt}
        className="w-1/2"
      />
    </div>
  );
}
