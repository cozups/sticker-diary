'use client';

import { useRecoilValue } from 'recoil';
import { dateLoadingState, dateState, scheduleState } from '@/app/states';
import { formatDate } from '@/app/utils';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ScheduleCell from './ScheduleCell';
import { Schedule } from '@/app/types';

export default function Scheduler() {
  const { selectedDate } = useRecoilValue(dateState);
  const monthSchedules = useRecoilValue(scheduleState);
  const isLoading = useRecoilValue(dateLoadingState);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    if (monthSchedules) {
      const schedulesOfToday =
        monthSchedules.get(formatDate(selectedDate)) || [];
      setSchedules(schedulesOfToday);
    }
  }, [selectedDate, monthSchedules]);

  return (
    <div
      id="schedulerContainer"
      className="flex flex-col h-full items-center justify-center"
    >
      <div id="schedulerHeader" className="flex-none">
        <h1 className="font-bold text-center pt-3 pb-1 text-xl">Schedule</h1>
        <div className="text-sm text-center text-gray-500">
          {formatDate(selectedDate)}
        </div>
      </div>
      <div id="schedulerBody" className="w-full grow p-4">
        <div className="w-full h-full">
          {schedules.length ? (
            schedules.map((schedule) => (
              <ScheduleCell key={schedule.id} schedule={schedule} />
            ))
          ) : (
            <div className="font-semibold text-center h-full flex flex-col justify-center items-center">
              스케줄이 없습니다.
            </div>
          )}
        </div>
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
