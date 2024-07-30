'use client';

import {
  dateLoadingState,
  dateState,
  diaryState,
  scheduleState,
} from '@/app/states';
import { formatDate } from '@/app/utils';
import {
  addMonths,
  format,
  subMonths,
  startOfWeek,
  addDays,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameDay,
} from 'date-fns';
import { useEffect, useState } from 'react';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { useRecoilState } from 'recoil';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import RoundImage from '../UI/RoundImage';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateLoading, setDateLoading] = useRecoilState(dateLoadingState);
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);
  const [schedules, setSchedules] = useRecoilState(scheduleState);
  const [diaries, setDiaries] = useRecoilState(diaryState);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSchedules = async () => {
      setDateLoading(true);
      const schedulesResponse = await fetch(
        `/api/schedules?date=${formatDate(currentDate)}`
      );
      const fetchedSchedules = await schedulesResponse.json();

      const diaryResponse = await fetch(
        `/api/diary?date=${formatDate(currentDate)}`
      );
      const fetchedDiary = await diaryResponse.json();

      setSchedules(fetchedSchedules);
      setDiaries(fetchedDiary);
      setDateLoading(false);
    };

    fetchSchedules();
  }, [currentDate, setSchedules, setDateLoading, setDiaries]);

  const renderHeader = () => {
    const dateFormat = 'yyyy년 M월';

    return (
      <div className="flex items-center justify-center gap-8 py-4 border-b border-gray-300">
        <div>
          <div
            className="icon"
            onClick={() => setCurrentDate((prev) => subMonths(currentDate, 1))}
          >
            <MdKeyboardDoubleArrowLeft />
          </div>
        </div>
        <div>
          <span className="font-bold">{format(currentDate, dateFormat)}</span>
        </div>
        <div
          onClick={() => setCurrentDate((prev) => addMonths(currentDate, 1))}
        >
          <div className="icon">
            <MdKeyboardDoubleArrowRight />
          </div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEEE';
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={i}
          className={`w-full text-center font-semibold ${
            i === 0 && 'text-red-500'
          } ${i === 6 && 'text-blue-500'}`}
        >
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return (
      <div className="flex justify-between w-full py-3 bg-indigo-100">
        {days}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const scheduleOfToday = schedules.filter((schedule) =>
          isSameDay(schedule.date, day)
        );
        const diaryOfToday = diaries.filter((diary) =>
          isSameDay(diary.date, day)
        )[0];
        days.push(
          <div
            key={day.toDateString()}
            className={`relative text-center h-24 w-full border  ${
              !isSameMonth(day, monthStart) && 'text-gray-300'
            } ${
              isSameDay(day, selectedDate)
                ? 'border border-blue-300'
                : 'border-gray-50'
            }`}
            onClick={() => {
              setSelectedDate(cloneDay);
            }}
          >
            <span className="number">{formattedDate}</span>
            <div className="flex items-center flex-wrap gap-1">
              {scheduleOfToday.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-sky-100 text-xs rounded-full w-3 h-3"
                ></div>
              ))}
            </div>
            {diaryOfToday && (
              <div className="absolute bottom-1 right-1">
                <RoundImage
                  src={
                    session?.user.stickers
                      ? session.user.stickers[diaryOfToday.expression]
                      : `/stickers/${diaryOfToday.expression}.png`
                  }
                  width={60}
                  height={60}
                  alt="expression"
                />
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="flex justify-between w-full" key={day.toDateString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="">{rows}</div>;
  };

  return (
    <div className="border rounded-xl">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
