import { Schedule } from '@/app/types';
import { useRouter } from 'next/navigation';

export default function ScheduleCell({ schedule }: { schedule: Schedule }) {
  const router = useRouter();

  const onClick = (e: React.MouseEvent) => {
    router.push(`/schedule/details/${schedule.id}`);
  };

  return (
    <div
      className="w-full rounded-xl mb-2 cursor-pointer overflow-hidden shadow-sm"
      onClick={onClick}
    >
      <h2 className="font-semibold text-lg pl-2 py-1 bg-sky-50">
        {schedule.title}
      </h2>
      <p className="pl-2 h-16 text-gray-400 text-sm pt-1 bg-white">
        {schedule.description}
      </p>
    </div>
  );
}
