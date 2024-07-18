'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import { MdOutlinePhotoFilter } from 'react-icons/md';

interface EditFormInput {
  image?: string;
  username: string;
}

export default function Edit() {
  const { data: session, update } = useSession();
  const { register, handleSubmit } = useForm<EditFormInput>();
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState(
    session?.user?.image || '/default_profile.png'
  );

  const onClickImage = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    if (!imageInputRef.current) return;

    imageInputRef.current.click();
  };

  const onSetImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!imageInputRef.current?.files?.length) return;

    const file = imageInputRef?.current?.files[0] as File;
    const fileURL = URL.createObjectURL(file);

    setImageSrc(fileURL);
  };

  const onSubmit: SubmitHandler<EditFormInput> = async (
    data: EditFormInput
  ) => {
    data.image = session?.user?.image || '';
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        email: session?.user?.email,
      }),
    });

    if (imageInputRef.current?.files?.length) {
      const imageFile: File = imageInputRef.current.files[0];
      const prevProfileImage = session?.user?.image;

      // upload image
      const formData = new FormData();
      formData.append('email', session?.user?.email || '');
      formData.append('image', imageFile);

      const uploadImageResponse = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      const { url } = await uploadImageResponse.json();

      data.image = url;

      // delete previous image
      const deleteImageResponse = await fetch('/api/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: prevProfileImage,
        }),
      });
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: data.username,
        image: data.image,
      },
    };

    await update(newSession);

    router.push('/');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center"
    >
      <div className="cursor-pointer rounded-full w-32 h-32 overflow-hidden edit-image relative">
        <div
          onClick={onClickImage}
          className="bg-black bg-opacity-30 absolute top-0 left-0 w-full h-full flex justify-center items-center"
        >
          <MdOutlinePhotoFilter color="white" className="w-1/3 h-1/3" />
        </div>
        <Image
          src={imageSrc}
          alt="profile"
          width={500}
          height={500}
          ref={imageRef}
          className="w-auto h-full object-cover"
        />
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          className="hidden"
          onChange={onSetImage}
        />
      </div>

      <div className="flex flex-col justify-center items-start">
        <label htmlFor="username" className="font-bold">
          이름
        </label>
        <input
          id="username"
          className="border"
          {...register('username', { value: session?.user?.name || '' })}
        />
      </div>

      <button
        type="submit"
        className="bg-indigo-800 text-white px-2 py-1 rounded-lg"
      >
        수정하기
      </button>
    </form>
  );
}
