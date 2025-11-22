export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 bg-neutral-800 text-xs text-gray-300 rounded">
      {children}
    </span>
  );
}
