import Calendar from '@components/Calendar';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 h-full p-8">
      <div className="h-full">
        <Calendar />
      </div>
      <div className="border h-full col-span-2">today</div>
    </div>
  );
}
