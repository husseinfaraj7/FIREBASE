'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { carConverter } from '@/firebase/converters/carConverter';
import type { Car } from '@/types';
import { CarCard } from '@/components/car-card';
import { Loader2 } from 'lucide-react';

export function FeaturedCarsContent() {
  const firestore = useFirestore();
  const carsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'cars').withConverter(carConverter) : null),
    [firestore]
  );
  const carsQuery = useMemoFirebase(() => {
    if (!carsCollection) return null;
    return query(
      carsCollection,
      where('featured', '==', true),
      limit(3)
    );
  }, [carsCollection]);

  const { data: featuredCars, isLoading } = useCollection<Car>(carsQuery);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredCars?.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
