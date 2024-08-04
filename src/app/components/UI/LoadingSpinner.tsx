export default function LoadingSpinner() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-14 h-14 rounded-full bg-transparent border-indigo-100 border-t-indigo-700 border-8 animate-spin"></div>
    </div>
  );
}
