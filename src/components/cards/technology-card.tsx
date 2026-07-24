type TechnologyCardProps = {
  name: string;
  icon: React.ReactNode;
};

export function TechnologyCard({
  name,
  icon,
}: TechnologyCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-all hover:-translate-y-1 hover:shadow-md">
      <div>{icon}</div>

      <span className="font-medium">
        {name}
      </span>
    </div>
  );
}