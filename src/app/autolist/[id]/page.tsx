'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { Button } from '@/components/ui/button';
import { ImageGallery } from '@/components/autolist/[id]/image-gallery';
import { CarDetails } from '@/components/autolist/[id]/car-details';
import { CarInquiryForm } from '@/components/autolist/[id]/car-inquiry-form';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { Car } from '@/types';

function CarDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const firestore = useFirestore();

  const carRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'cars', id);
  }, [firestore, id]);

  const { data: car, isLoading, error } = useDoc<Car>(carRef);

  // Redirect only when loading is finished AND car is confirmed missing
  useEffect(() => {
    if (!isLoading && !car) {
      const timeout = setTimeout(() => router.replace('/autolist'), 100);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, car, router]);

  // 🔹 While loading, show spinner
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Caricamento dettagli auto...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 🔹 If car not found after loading, render nothing while redirect happens
  if (!car) {
    return null;
  }

  // ✅ Render details once we have valid car data
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-secondary/30 py-8 md:py-12">
        <div className="container">
          <Button asChild variant="ghost" className="mb-4 -ml-4">
            <Link href="/autolist">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna all'elenco
            </Link>
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ImageGallery images={car.images || []} carName={`${car.make} ${car.model}`} />
            </div>
            <div className="lg:col-span-1">
              <CarDetails car={car} />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Descrizione</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>{car.description}</p>
                <p>
                  Questo veicolo è dotato di documentazione di manutenzione e viene fornito con una garanzia per la vostra tranquillità. Con solo{' '}
                  {car.owners || 1} precedente proprietario, è un'occasione da non perdere.
                </p>
              </div>
            </div>
            <div className="lg:col-span-1">
              <CarInquiryForm carId={id} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CarDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  if (!id) {
    // If the URL is malformed or param is missing
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Caricamento...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <CarDetailContent id={id} />;
}
