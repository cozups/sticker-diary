import { CalendarDate } from '@/app/types';
import { isSameDay, isSameMonth } from 'date-fns';

interface CalendarCellProps {
  day: Date;
  monthStart: Date;
  date: Date;
  onClick: () => void;
  formattedDate: string;
  children: React.ReactNode;
}

export default function CalendarCell({
  day,
  monthStart,
  date,
  onClick,
  formattedDate,
  children,
}: CalendarCellProps) {
  return (
    <div
      key={day.toDateString()}
      className={`relative text-center h-24 w-full border  ${
        !isSameMonth(day, monthStart) && 'text-gray-300'
      } ${isSameDay(day, date) ? 'border border-blue-300' : 'border-gray-50'}`}
      onClick={onClick}
    >
      <span className="number">{formattedDate}</span>
      {children}
    </div>
  );
}
