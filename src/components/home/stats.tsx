import { stats } from '@/lib/data';

export function Stats() {
  return (
    <section className="bg-secondary">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl md:text-5xl font-bold text-primary font-headline">{stat.value}</p>
              <p className="mt-2 text-sm md:text-base text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
