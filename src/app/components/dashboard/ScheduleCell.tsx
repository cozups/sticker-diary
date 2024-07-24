import { useRouter } from 'next/navigation';
import { Schedule } from './Schedule';

export default function ScheduleCell({ schedule }: { schedule: Schedule }) {
  const router = useRouter();

  const onClick = (e: React.MouseEvent) => {
    router.push(`/schedule/details/${schedule.id}`);
  };

  return (
    <div className="border rounded-lg my-2 cursor-pointer" onClick={onClick}>
      <h2 className="border-b font-semibold bg-orange-50 text-lg pl-2 py-1">
        {schedule.title}
      </h2>
      <p className="pl-2 h-16 text-gray-500 text-sm pt-1">
        {schedule.description}
      </p>
    </div>
  );
}
