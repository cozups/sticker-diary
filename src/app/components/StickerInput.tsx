import Image from 'next/image';
import { Dispatch, SetStateAction, useRef, useState } from 'react';

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
    <div>
      <Image src={imageSrc} width={96} height={96} alt={alt} />
      <p className="font-semibold">{title}</p>
      <input
        type="file"
        accept="image/*"
        onChange={onChangeInput}
        ref={inputRef}
        name={alt}
      />
    </div>
  );
}
