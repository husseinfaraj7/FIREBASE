import Image from 'next/image';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { whyChooseUs, team } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const AboutHero = () => {
  const image = PlaceHolderImages.find(p => p.id === 'about-hero');
  return (
    <section className="relative bg-secondary py-20 md:py-32">
       {image && (
        <Image
          src={image.imageUrl}
          alt={image.description}
          data-ai-hint={image.imageHint}
          fill
          className="object-cover opacity-10"
        />
      )}
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">La Nostra Passione per le Auto</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Da oltre un decennio, MiniCar si impegna a offrire non solo automobili, ma vere e proprie esperienze di guida, basate su fiducia, qualità e trasparenza.
        </p>
      </div>
    </section>
  );
};

const HistoryMission = () => (
  <section className="py-16 md:py-24">
    <div className="container grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl font-bold mb-4">La Nostra Storia</h2>
        <p className="text-muted-foreground mb-4">
          Nata nel cuore di Milano, MiniCar è cresciuta da una piccola concessionaria a un punto di riferimento per l'acquisto di auto usate di alta qualità. La nostra missione è sempre stata quella di rendere l'acquisto di un'auto un'esperienza piacevole, sicura e trasparente. Crediamo che ogni cliente meriti il meglio, ed è per questo che ogni veicolo nel nostro parco auto è selezionato e ispezionato con la massima cura.
        </p>
        <p className="text-muted-foreground">
          Siamo orgogliosi di aver costruito una reputazione basata sull'onestà e sulla soddisfazione del cliente, consegnando oltre 500 auto a clienti felici in tutta Italia.
        </p>
      </div>
      <div className="bg-primary text-primary-foreground p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4">La Nostra Missione</h3>
        <blockquote className="border-l-4 border-accent pl-4 italic text-lg">
          "Offrire ai nostri clienti le migliori auto usate sul mercato, garantendo qualità, sicurezza e un servizio clienti eccezionale che costruisca relazioni di fiducia a lungo termine."
        </blockquote>
      </div>
    </div>
  </section>
);

const TeamSection = () => (
  <section className="py-16 md:py-24 bg-secondary">
    <div className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Il Nostro Team</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Professionisti appassionati pronti a guidarti nella scelta giusta.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.map((member) => {
          const image = PlaceHolderImages.find(p => p.id === member.image);
          return (
            <Card key={member.name} className="text-center">
              <CardContent className="p-6">
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={member.name}
                    data-ai-hint={image.imageHint}
                    width={128}
                    height={128}
                    className="rounded-full mx-auto mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  </section>
);

const WhyChooseUsSection = () => (
  <section className="py-16 md:py-24">
    <div className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Perché Scegliere MiniCar</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          I nostri impegni per garantirti un'esperienza d'acquisto superiore.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {whyChooseUs.map((item) => (
          <div key={item.title} className="flex items-start gap-4">
            <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
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

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AboutHero />
        <HistoryMission />
        <TeamSection />
        <WhyChooseUsSection />
      </main>
      <Footer />
    </div>
  );
}
