import { whyChooseUs } from '@/lib/data';

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Perché Scegliere MiniCar</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            I nostri impegni per garantirti un'esperienza d'acquisto superiore.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
