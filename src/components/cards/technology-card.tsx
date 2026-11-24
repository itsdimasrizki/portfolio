type TechnologyCardProps = {
  name: string;
  icon: React.ReactNode;
};

export function TechnologyCard({
  name,
  icon,
}: TechnologyCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-none border border-border bg-card px-4 py-3 transition-colors duration-200 hover:border-foreground/40 shadow-xs">
      <div className="text-primary text-base">{icon}</div>

      <span className="font-mono text-xs uppercase tracking-wider text-foreground">
        {name}
      </span>
    </div>
  );
}
