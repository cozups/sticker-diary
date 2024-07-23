'use client';

import { useRecoilState, useRecoilValue } from 'recoil';
import { dateLoadingState, dateState, scheduleState } from '@/app/states';
import { formatDate } from '@/app/utils';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ScheduleCell from './ScheduleCell';
import { isSameDay } from 'date-fns';

export interface Schedule {
  id: string;
  userId: string;
  date: string;
  title: string;
  description: string;
}

export default function Scheduler() {
  const [date] = useRecoilState(dateState);
  const [monthSchedules] = useRecoilState<Schedule[]>(scheduleState);
  const isLoading = useRecoilValue(dateLoadingState);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const filtered = monthSchedules.filter((sc) => isSameDay(sc.date, date));
      setSchedules(filtered);
    };

    fetchSchedules();
  }, [date, monthSchedules]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="font-bold text-center pt-3 pb-1 text-xl ">Schedule</h1>
      <div className="text-sm text-center text-gray-500">
        {formatDate(date)}
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        {isLoading && <div>loading...</div>}
        {!isLoading && (
          <div className="w-full h-full">
            {!schedules.length ? (
              <div className="flex justify-center items-center font-semibold h-full">
                스케줄이 없습니다.
              </div>
            ) : (
              <div className="px-4 py-8 overflow-scroll">
                {schedules.map((schedule) => (
                  <ScheduleCell key={schedule.id} schedule={schedule} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Link href={'/schedule'} className="shadow px-4 py-2 rounded block mb-4">
        +
      </Link>
    </div>
  );
}
