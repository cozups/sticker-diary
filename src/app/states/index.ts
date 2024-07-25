import { atom } from 'recoil';
import { Schedule, Diary } from '@/app/types';

export const dateState = atom<Date>({
  key: 'dateState',
  default: new Date(),
});

export const dateLoadingState = atom<boolean>({
  key: 'dateLoadingState',
  default: false,
});

export const scheduleState = atom<Schedule[]>({
  key: 'scheduleState',
  default: [],
});

export const diaryState = atom<Diary[]>({
  key: 'diaryState',
  default: [],
});
