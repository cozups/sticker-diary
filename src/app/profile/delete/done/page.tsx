import Link from 'next/link';

export default function DeleteProfileDone() {
  return (
    <div>
      <h1>탈퇴가 완료되었습니다.</h1>
      <p>안녕히가세요.</p>
      <Link href={'/'}>홈으로</Link>
    </div>
  );
}
