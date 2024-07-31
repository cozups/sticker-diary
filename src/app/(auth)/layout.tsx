export default function AuthFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-1/3 shadow pb-12 rounded-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}
