import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import RoundImage from '../../UI/RoundImage';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useSession } from 'next-auth/react';
import { dateState, diaryState, scheduleState } from '@/app/states';
import { formatDate } from '@/app/utils';
import { Diary, Schedule } from '@/app/types';
import CalendarCell from './CalendarCell';

export default function CalendarBody() {
  const [date, setDate] = useRecoilState(dateState);
  const schedules: Map<string, Schedule[]> = useRecoilValue(scheduleState);
  const diaries: Map<string, Diary> = useRecoilValue(diaryState);
  const { data: session } = useSession();

  // 캘린더 셀(일자) 렌더
  const monthStart = startOfMonth(date.currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = 'd';
  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = '';

  while (day <= endDate) {
    // 한 주씩 렌더링
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const schedulesOfToday: Schedule[] = schedules.get(formatDate(day)) || [];
      const diaryOfToday = diaries.get(formatDate(day));

      // 캘린더 셀 렌더링
      days.push(
        <CalendarCell
          key={day.toString()}
          day={day}
          monthStart={monthStart}
          formattedDate={formattedDate}
          date={date.selectedDate}
          onClick={() => {
            setDate((prev) => ({ ...prev, selectedDate: cloneDay }));
          }}
        >
          <div className="flex items-center flex-wrap gap-1">
            {schedulesOfToday.map((schedule) => (
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
        </CalendarCell>
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
}
