import Scheduler from '@components/dashboard/Schedule';

export default function Board() {
  return (
    <div className="grid grid-cols-2 h-full">
      <Scheduler />
      <div>
        <h1>Diary</h1>
      </div>
    </div>
  );
}
