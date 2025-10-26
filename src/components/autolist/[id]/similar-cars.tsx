'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2, AlertTriangle } from 'lucide-react';
import type { Car } from '@/types';
import { recommendCars } from '@/ai/flows/car-recommendation-tool';

type SimilarCarsProps = {
  car: Car;
};

export function SimilarCars({ car }: SimilarCarsProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const input = {
        price: car.price,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
      };
      const result = await recommendCars(input);
      setRecommendations(result);
    } catch (e) {
      setError('Impossibile ottenere suggerimenti in questo momento. Riprova più tardi.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          <span>Trova Auto Simili con l'IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Non sei convinto? Lascia che la nostra intelligenza artificiale ti suggerisca 3 alternative basate sulle caratteristiche di questa auto.
        </p>
        <Button onClick={handleGetRecommendations} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ricerca in corso...
            </>
          ) : (
            'Ottieni Suggerimenti'
          )}
        </Button>
        
        {error && (
            <div className="mt-4 text-destructive text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <p>{error}</p>
            </div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold">Ecco cosa abbiamo trovato per te:</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
