import { format } from 'date-fns';

export function createRandomString(length: number) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatDate(date: Date) {
  const dateFormat = 'yyyy-MM-dd';

  return format(date, dateFormat);
}

export function base64ToFile(base64Data: string, fileName: string) {
  const byteString = atob(base64Data.split(',')[1]);

  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([uint8Array], { type: 'image/png' });

  return new File([blob], fileName, { type: 'image/png' });
}
