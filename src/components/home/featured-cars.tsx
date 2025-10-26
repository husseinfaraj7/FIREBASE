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
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Le Nostre Proposte in Vetrina</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Una selezione delle migliori auto disponibili, scelte per te dal nostro team.
          </p>
        </div>
        
        <FeaturedCarsContent />
        
        <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="group">
                <Link href="/autolist">
                    Vedi tutte le auto
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
