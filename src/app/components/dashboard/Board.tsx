import Scheduler from '@/app/components/dashboard/Scheduler';
import Diary from '@/app/components/dashboard/Diary';

export default function Board() {
  return (
    <div className="grid grid-cols-2 h-full">
      <Scheduler />
      <Diary />
    </div>
  );
}
