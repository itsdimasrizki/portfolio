type TechnologyCardProps = {
  name: string;
  icon: React.ReactNode;
};

export function TechnologyCard({
  name,
  icon,
}: TechnologyCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-teal-700/40 hover:shadow-md">
      <div className="text-teal-700">{icon}</div>

      <span className="text-sm font-medium">
        {name}
      </span>
    </div>
  );
}