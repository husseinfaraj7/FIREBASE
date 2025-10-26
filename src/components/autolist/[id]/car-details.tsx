import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Car } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gauge, Cog, Droplets, PaintBucket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

type CarDetailsProps = {
  car: Car;
}

export function CarDetails({ car }: CarDetailsProps) {
  const formattedPrice = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(car.price);
  const formattedMileage = new Intl.NumberFormat('it-IT').format(car.mileage);

  const details = [
    { label: "Anno", value: car.year, icon: Calendar },
    { label: "Chilometraggio", value: `${formattedMileage} km`, icon: Gauge },
    { label: "Cambio", value: car.transmission, icon: Cog },
    { label: "Alimentazione", value: car.fuelType, icon: Droplets },
    { label: "Colore", value: car.color || 'N/D', icon: PaintBucket },
    { label: "Proprietari", value: car.owners || 1, icon: Users },
  ];

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-2xl !font-headline">{car.make} {car.model}</CardTitle>
                 <CardDescription>{car.category}</CardDescription>
            </div>
             {!car.available && <Badge variant="destructive">Venduta</Badge>}
        </div>
        <p className="text-3xl font-bold text-primary pt-2">{formattedPrice}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <h3 className="font-semibold">Dettagli Veicolo</h3>
            <ul className="grid grid-cols-2 gap-4 text-sm">
                {details.map(detail => (
                    <li key={detail.label} className="flex items-center gap-2">
                        <detail.icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <span className="font-semibold text-muted-foreground">{detail.label}: </span>
                            <span className="text-foreground">{detail.value}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        <div className="mt-6 flex flex-col gap-2">
            <Button size="lg" disabled={!car.available} className="w-full">
                {car.available ? "Richiedi Informazioni" : "Non Disponibile"}
            </Button>
            <Button size="lg" variant="outline" className="w-full">
                Calcola Finanziamento
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
