import { auth } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Landing() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return <div>Landing</div>;
}
