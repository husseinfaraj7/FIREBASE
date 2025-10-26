import { services } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function Services() {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Servizi Pensati per Te</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Offriamo una gamma completa di servizi per garantirti un acquisto sicuro e sereno.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary mb-4">
                  <service.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="!font-body">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
