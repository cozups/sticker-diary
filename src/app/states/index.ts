import { atom } from 'recoil';
import { Schedule } from '@components/dashboard/Schedule';

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
