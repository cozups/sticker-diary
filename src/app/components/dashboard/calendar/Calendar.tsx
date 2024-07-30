'use client';

import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  dateLoadingState,
  dateState,
  diaryState,
  scheduleState,
} from '@/app/states';
import { formatDate } from '@/app/utils';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import CalendarBody from './CalendarBody';
import { Diary, Schedule } from '@/app/types';

export default function Calendar() {
  const date = useRecoilValue(dateState);
  const setDateLoading = useSetRecoilState(dateLoadingState);
  const setSchedules = useSetRecoilState(scheduleState);
  const setDiaries = useSetRecoilState(diaryState);

  useEffect(() => {
    const fetchSchedules = async () => {
      setDateLoading(true);
      const schedulesResponse = await fetch(
        `/api/schedules?date=${formatDate(date.currentDate)}`
      );
      const fetchedSchedules = await schedulesResponse.json();

      const diaryResponse = await fetch(
        `/api/diary?date=${formatDate(date.currentDate)}`
      );
      const fetchedDiary = await diaryResponse.json();

      if (fetchedSchedules) {
        const scheduleMap = new Map();
        fetchedSchedules.forEach((sc: Schedule) => {
          const date = formatDate(sc.date);
          if (!scheduleMap.has(date)) {
            scheduleMap.set(date, [sc]);
          } else {
            scheduleMap.get(date).push(sc);
          }
        });
        setSchedules(scheduleMap);
      }

      if (fetchedDiary) {
        const diaryMap = new Map();
        fetchedDiary.forEach((dr: Diary) => {
          const date = formatDate(dr.date);
          diaryMap.set(date, dr);
        });
        setDiaries(diaryMap);
      }

      setDateLoading(false);
    };

    fetchSchedules();
  }, [date.currentDate, setSchedules, setDateLoading, setDiaries]);

  return (
    <div className="border rounded-xl">
      <CalendarHeader />
      <CalendarDays />
      <CalendarBody />
    </div>
  );
}
