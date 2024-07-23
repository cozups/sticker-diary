import { Schedule } from './Schedule';

export default function ScheduleCell({ schedule }: { schedule: Schedule }) {
  return (
    <div className="border rounded-lg my-2">
      <h2 className="border-b font-semibold bg-orange-50 text-lg pl-2 py-1">
        {schedule.title}
      </h2>
      <p className="pl-2 h-16 text-gray-500 text-sm pt-1">
        {schedule.description}
      </p>
    </div>
  );
}
