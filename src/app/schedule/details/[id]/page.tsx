import ClientButtons from '@/app/components/schedules/ClientButtons';
import { prisma } from '@/app/lib/prisma';

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

  return (
    <div className="flex flex-col items-center border w-1/2 my-8 mx-auto rounded-xl overflow-hidden">
      <h1 className="text-2xl font-bold py-8 bg-orange-50 w-full text-center">
        {schedule?.title}
      </h1>
      <p>{schedule?.date.toDateString()}</p>
      <p className="py-4 min-h-48">{schedule?.description}</p>
      <ClientButtons id={params.id} />
    </div>
  );
}
