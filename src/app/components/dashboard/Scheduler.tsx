'use client';

import { useRecoilValue } from 'recoil';
import { dateLoadingState, dateState, scheduleState } from '@/app/states';
import { formatDate } from '@/app/utils';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ScheduleCell from './ScheduleCell';
import { isSameDay } from 'date-fns';
import { Schedule } from '@/app/types';

export default function Scheduler() {
  const date = useRecoilValue(dateState);
  const monthSchedules = useRecoilValue(scheduleState);
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
      <div>
        <h1 className="font-bold text-center pt-3 pb-1 text-xl">Schedule</h1>
        <div className="text-sm text-center text-gray-500">
          {formatDate(date)}
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center flex-grow overflow-y-auto px-4 py-8">
        {isLoading ? (
          <div>loading...</div>
        ) : (
          <div className="w-full">
            {schedules.length ? (
              schedules.map((schedule) => (
                <ScheduleCell key={schedule.id} schedule={schedule} />
              ))
            ) : (
              <div className="font-semibold text-center">
                스케줄이 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
      <Link
        href={'/schedule/add'}
        className="shadow px-4 py-2 rounded block my-4"
      >
        +
      </Link>
    </div>
  );
}
