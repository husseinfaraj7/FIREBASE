'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const FeaturedCarsContent = dynamic(() => import('./featured-cars-content').then(mod => mod.FeaturedCarsContent), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Skeleton className="h-[400px] w-full" />
      <Skeleton className="h-[400px] w-full" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  )
});

export function FeaturedCars() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" aria-hidden="true" />
      <div className="container relative">
        <div className="text-center mb-12">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            In evidenza
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl font-bold">Le Nostre Proposte in Vetrina</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Una selezione delle migliori auto disponibili, scelte per te dal nostro team.
          </p>
        </div>

        <FeaturedCarsContent />

        <div className="mt-12 text-center">
            <Button asChild size="lg" className="group rounded-full border border-border/60 bg-white shadow-sm hover:bg-white/90">
                <Link href="/autolist" className="flex items-center justify-center">
                    Vedi tutte le auto
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
