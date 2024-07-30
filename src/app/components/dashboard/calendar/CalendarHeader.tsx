import { useState } from 'react';
import { subMonths, addMonths, format } from 'date-fns';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { useRecoilState } from 'recoil';
import { dateState } from '@/app/states';

export default function CalendarHeader() {
  const [date, setDate] = useRecoilState(dateState);
  const dateFormat = 'yyyy년 M월';

  return (
    <div className="flex items-center justify-center gap-8 py-4 border-b border-gray-300">
      <div>
        <div
          className="icon"
          onClick={() =>
            setDate((prev) => ({
              ...prev,
              currentDate: subMonths(date.currentDate, 1),
            }))
          }
        >
          <MdKeyboardDoubleArrowLeft />
        </div>
      </div>
      <div>
        <span className="font-bold">
          {format(date.currentDate, dateFormat)}
        </span>
      </div>
      <div
        onClick={() =>
          setDate((prev) => ({
            ...prev,
            currentDate: addMonths(date.currentDate, 1),
          }))
        }
      >
        <div className="icon">
          <MdKeyboardDoubleArrowRight />
        </div>
      </div>
    </div>
  );
}
