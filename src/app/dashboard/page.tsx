import Calendar from '@components/dashboard/Calendar';
import Board from '@components/dashboard/Board';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 h-full p-8 gap-2">
      <div className="h-full">
        <Calendar />
      </div>
      <div className="border h-full col-span-2">
        <Board />
      </div>
    </div>
  );
}
