import { dateState } from '@/app/states';
import { addDays, format, startOfWeek } from 'date-fns';
import { useRecoilValue } from 'recoil';

export default function CalendarDays() {
  const date = useRecoilValue(dateState);

  const days = [];
  const dateFormat = 'EEEEE';
  const startDate = startOfWeek(date.currentDate);

  for (let i = 0; i < 7; i++) {
    days.push(
      <div
        key={`day-${i}`}
        className={`w-full text-center font-semibold ${
          i === 0 && 'text-red-500'
        } ${i === 6 && 'text-blue-500'}`}
      >
        {format(addDays(startDate, i), dateFormat)}
      </div>
    );
  }

  return (
    <div className="flex justify-between w-full py-3 bg-indigo-100">{days}</div>
  );
}
