'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  customStyle?: string;
}

export default function Button({
  children,
  customStyle = '',
  onClick,
}: ButtonProps) {
  return (
    <button className={'rounded px-2 py-1 ' + customStyle} onClick={onClick}>
      {children}
    </button>
  );
}
