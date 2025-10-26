
import type { Car } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gauge, Cog, Calendar } from 'lucide-react';

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  const isValidImageSrc = (src: string | undefined | null): boolean => {
    if (!src) return false;
    return src.startsWith('http') || src.startsWith('data:');
  }
  
  const imageSrc = car.images?.[0];
  const image = isValidImageSrc(imageSrc) ? imageSrc : "https://picsum.photos/seed/placeholder/600/400";
  const formattedPrice = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(car.price);
  const formattedMileage = new Intl.NumberFormat('it-IT').format(car.mileage);

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all hover:shadow-xl hover:-translate-y-1">
      <Link href={`/autolist/${car.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3]">
            <Image
              src={image}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover"
            />
            {!car.available && (
                <Badge variant="destructive" className="absolute top-3 right-3">Venduta</Badge>
            )}
             <Badge variant="secondary" className="absolute top-3 left-3">{car.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4 space-y-2">
            <CardTitle className="text-lg font-bold leading-tight !font-headline">
                {car.make} {car.model}
            </CardTitle>
            <p className="text-xl font-semibold text-primary">{formattedPrice}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{car.description}</p>
        </CardContent>
        <CardFooter className="p-4 bg-secondary/50">
            <div className="grid grid-cols-3 gap-2 w-full text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary/70"/>
                    <span>{car.year}</span>
                </div>
                 <div className="flex items-center gap-1.5">
                    <Gauge className="h-4 w-4 text-primary/70"/>
                    <span>{formattedMileage} km</span>
                </div>
                 <div className="flex items-center gap-1.5">
                    <Cog className="h-4 w-4 text-primary/70"/>
                    <span>{car.transmission}</span>
                </div>
            </div>
        </CardFooter>
      </Link>
    </Card>
  );
}

    