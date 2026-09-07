/**
 * Belum dirender di mana pun — `hero/index.tsx` hanya memasang HeroContent dan
 * HeroImage. Labelnya tetap dibuat dwibahasa supaya tidak ada teks Inggris
 * yang tertinggal di kode saat komponen ini dipakai nanti.
 *
 * Angkanya sengaja tetap tertulis mati: menurunkannya dari data adalah
 * keputusan pemilik, bukan bagian dari pekerjaan dwibahasa.
 */
export function HeroStats({ labels }: { labels: string[] }) {
  const values = ["5+", "12+", "30+"];

  return (
    <div className="grid grid-cols-3 gap-4">
      {values.map((value, i) => (
        <div
          key={value}
          className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xs"
        >
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {labels[i] ?? ""}
          </p>
        </div>
      ))}
    </div>
  );
}
