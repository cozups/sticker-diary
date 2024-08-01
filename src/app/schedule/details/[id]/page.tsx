import ClientButtons from '@/app/components/schedules/ClientButtons';
import { prisma } from '@/app/lib/prisma';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

export default async function ScheduleDetails({
  params,
}: {
  params: { id: string };
}) {
  const schedule = await prisma.schedule.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!schedule) {
    alert('wrong schedule ID!');
    redirect('/');
  }

  return (
    <div className="flex flex-col justify-center w-1/2 my-8 mx-auto rounded-xl overflow-hidden shadow px-12 py-6 relative">
      <h1 className="text-2xl font-bold border-b-4 border-blue-100 w-fit">
        {schedule.title}
      </h1>
      <p className="text-sm text-gray-500 my-2">
        {format(schedule.date, 'y년 M월 d일')}
      </p>
      <p className="py-4 min-h-36">{schedule?.description}</p>
      <ClientButtons id={params.id} />
    </div>
  );
}
