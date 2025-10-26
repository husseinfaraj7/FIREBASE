import { services } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function Services() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/60 to-background" aria-hidden="true" />
      <div className="container relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Servizi Pensati per Te</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Offriamo una gamma completa di servizi per garantirti un acquisto sicuro e sereno.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 text-center shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:shadow-xl backdrop-blur"
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-primary/10 via-transparent to-primary/30" />
              <CardHeader className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4 text-lg font-semibold">{service.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
