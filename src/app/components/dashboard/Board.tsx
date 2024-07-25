import Scheduler from '@/app/components/dashboard/Scheduler';
import DiaryBoard from '@/app/components/dashboard/DiaryBoard';

export default function Board() {
  return (
    <div className="grid grid-cols-2 h-full">
      <Scheduler />
      <DiaryBoard />
    </div>
  );
}
