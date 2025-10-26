import { whyChooseUs } from '@/lib/data';

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Perché Scegliere MiniCar</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            I nostri impegni per garantirti un'esperienza d'acquisto superiore.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-secondary/40 p-8 text-center shadow-[0_20px_45px_-24px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex flex-col items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
