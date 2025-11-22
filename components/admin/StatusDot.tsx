interface StatusDotProps {
  status: "published" | "draft" | "pending";
}

export default function StatusDot({ status }: StatusDotProps) {
  const colors = {
    published: "bg-green-500",
    draft: "bg-yellow-400",
    pending: "bg-gray-400",
  };

  return (
    <span className={`w-2 h-2 rounded-full ${colors[status]}`} />
  );
}
