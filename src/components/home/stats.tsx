import { stats } from '@/lib/data';

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-secondary/60">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="container relative py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-border/60 bg-card/90 p-8 text-center shadow-xl backdrop-blur"
            >
              <p className="text-4xl md:text-5xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-3 text-sm md:text-base uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
