
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import { addDocumentNonBlocking, setDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import type { Car } from '@/types';
import { CAR_CATEGORIES, FUEL_TYPES, TRANSMISSION_TYPES } from '@/lib/constants';
import { ChangeEvent, useRef } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  make: z.string().min(2, 'La marca è obbligatoria.'),
  model: z.string().min(1, 'Il modello è obbligatorio.'),
  year: z.coerce.number().int().min(1900, 'Anno non valido.').max(new Date().getFullYear() + 1, 'Anno non valido.'),
  price: z.coerce.number().min(0, 'Il prezzo non può essere negativo.'),
  mileage: z.coerce.number().int().min(0, 'Il chilometraggio non può essere negativo.'),
  fuelType: z.enum(["Benzina", "Diesel", "Elettrica", "Ibrida", "GPL", "Metano"]),
  transmission: z.enum(["Manuale", "Automatica"]),
  category: z.string().min(1, 'La categoria è obbligatoria.'),
  description: z.string().min(10, 'La descrizione deve avere almeno 10 caratteri.'),
  images: z.array(z.string()).min(1, 'Carica almeno un\'immagine.'),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  color: z.string().optional(),
  owners: z.coerce.number().int().min(0).optional(),
});

type CarFormProps = {
  car?: Car | null;
  onFinished: () => void;
};

export function CarForm({ car, onFinished }: CarFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: car?.make || '',
      model: car?.model || '',
      year: car?.year || new Date().getFullYear(),
      price: car?.price || 0,
      mileage: car?.mileage || 0,
      fuelType: car?.fuelType || 'Benzina',
      transmission: car?.transmission || 'Manuale',
      category: car?.category || '',
      description: car?.description || '',
      images: car?.images || [],
      available: car?.available ?? true,
      featured: car?.featured ?? false,
      color: car?.color || '',
      owners: car?.owners || 1,
    },
  });

  const { isSubmitting } = form.formState;
  const imageValues = form.watch('images');

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const currentImages = form.getValues('images');
    const newImages: string[] = [...currentImages];

    Array.from(files).forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({ variant: 'destructive', title: 'File troppo grande', description: `L'immagine ${file.name} supera i 5MB.` });
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({ variant: 'destructive', title: 'Tipo di file non valido', description: `L'immagine ${file.name} non è un formato supportato.` });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        newImages.push(dataUrl);
        form.setValue('images', newImages, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images');
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', newImages, { shouldValidate: true });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;

    try {
      if (car) {
        // Update existing car
        const carRef = doc(firestore, 'cars', car.id);
        setDocumentNonBlocking(carRef, {
            ...values,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        toast({
          title: 'Auto aggiornata!',
          description: `I dettagli di ${values.make} ${values.model} sono stati aggiornati.`,
        });
      } else {
        // Add new car
        const carsCollection = collection(firestore, 'cars');
        addDocumentNonBlocking(carsCollection, {
            ...values,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        toast({
          title: 'Auto aggiunta!',
          description: `${values.make} ${values.model} è stata aggiunta al tuo inventario.`,
        });
      }
      onFinished();
    } catch (error) {
      console.error('Error saving car: ', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Qualcosa è andato storto.',
        description: 'Impossibile salvare i dati dell\'auto. Riprova più tardi.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Es. Fiat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modello</FormLabel>
                <FormControl>
                  <Input placeholder="Es. 500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Immagini</FormLabel>
              <FormDescription>
                Carica le immagini dal tuo computer. La prima immagine sarà quella principale.
              </FormDescription>
              <FormControl>
                <div>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                    className="hidden"
                  />
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {imageValues.map((src, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden group">
                        <Image src={src} alt={`Anteprima ${index + 1}`} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                         <div className="absolute top-1 left-1 bg-black/60 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                            {index + 1}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="aspect-square flex-col gap-1"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Carica</span>
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Anno</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="Es. 2021" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Prezzo (€)</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="Es. 15000" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Chilometraggio (km)</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="Es. 25000" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Alimentazione</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleziona alimentazione" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {FUEL_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Cambio</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleziona cambio" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {TRANSMISSION_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
         <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleziona una categoria" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {CAR_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Descrizione</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Descrivi l'auto, le sue caratteristiche e condizioni."
                    rows={4}
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Colore</FormLabel>
                    <FormControl>
                    <Input placeholder="Es. Bianco Pastello" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="owners"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Numero Proprietari</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="Es. 1" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className="flex items-center space-x-4 pt-2">
            <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <FormLabel className="font-normal">
                        Disponibile per la vendita
                    </FormLabel>
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <FormLabel className="font-normal">
                        In Vetrina
                    </FormLabel>
                    </FormItem>
                )}
            />
        </div>


        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting || !firestore}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Salvataggio...' : 'Salva Auto'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
