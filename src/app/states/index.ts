import { atom } from 'recoil';
import { Schedule, Diary, CalendarDate } from '@/app/types';

export const dateState = atom<CalendarDate>({
  key: 'dateState',
  default: {
    currentDate: new Date(),
    selectedDate: new Date(),
  },
});

export const dateLoadingState = atom<boolean>({
  key: 'dateLoadingState',
  default: false,
});

export const scheduleState = atom<Map<string, Schedule[]>>({
  key: 'scheduleState',
  default: new Map(),
});

export const diaryState = atom<Map<string, Diary>>({
  key: 'diaryState',
  default: new Map(),
});
