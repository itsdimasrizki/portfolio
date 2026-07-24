export function HeroStats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xs">
        <p className="text-2xl font-bold tracking-tight">5+</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Years Experience
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xs">
        <p className="text-2xl font-bold tracking-tight">12+</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Projects
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xs">
        <p className="text-2xl font-bold tracking-tight">30+</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Certificates
        </p>
      </div>
    </div>
  );
}
