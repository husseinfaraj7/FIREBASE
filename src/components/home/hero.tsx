
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/80" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/40 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur">
          Gamma selezionata con cura
        </span>
        <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
          Trova l'Auto dei Tuoi Sogni
        </h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/80">
          Oltre 10 anni di esperienza nella vendita di auto usate di qualità, con garanzie trasparenti e assistenza dedicata.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white/90 text-foreground hover:bg-white shadow-lg shadow-black/20"
          >
            <Link href="/autolist">Vedi Auto Disponibili</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/40 text-white hover:bg-white/10 backdrop-blur"
          >
            <Link href="/contact">Contattaci</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
