'use client';

import Calendar from '@components/dashboard/calendar/Calendar';
import Board from '@components/dashboard/Board';
import { useRecoilValue } from 'recoil';
import { dateLoadingState } from '../states';
import LoadingSpinner from '../components/UI/LoadingSpinner';

export default function Dashboard() {
  const isLoading = useRecoilValue(dateLoadingState);

  return (
    <div className="grid grid-cols-3 w-full h-full p-8 gap-2">
      {isLoading && (
        <div className="w-full h-full absolute top-0 left-0 bg-white bg-opacity-50 z-10">
          <LoadingSpinner />
        </div>
      )}
      <div className="h-full">
        <Calendar />
      </div>
      <div className="border h-full col-span-2 rounded-xl">
        <Board />
      </div>
    </div>
  );
}
