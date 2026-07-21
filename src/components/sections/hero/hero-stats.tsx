export function HeroStats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border p-4">
        <p className="text-2xl font-bold">5+</p>
        <p className="text-sm text-muted-foreground">
          Years Experience
        </p>
      </div>

      <div className="rounded-xl border p-4">
        <p className="text-2xl font-bold">12+</p>
        <p className="text-sm text-muted-foreground">
          Projects
        </p>
      </div>

      <div className="rounded-xl border p-4">
        <p className="text-2xl font-bold">30+</p>
        <p className="text-sm text-muted-foreground">
          Certificates
        </p>
      </div>
    </div>
  );
}