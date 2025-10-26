
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center text-white">
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
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center p-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold !font-headline drop-shadow-md">
          Trova l'Auto dei Tuoi Sogni
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-200">
          Oltre 10 anni di esperienza nella vendita di auto usate di qualità
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary">
            <Link href="/autolist">Vedi Auto Disponibili</Link>
          </Button>
          <Button asChild size="lg" className="bg-black text-white hover:bg-neutral-800">
            <Link href="/contact">Contattaci</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
