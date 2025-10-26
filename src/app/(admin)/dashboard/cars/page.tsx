
'use client';

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { CarForm } from "./car-form";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { Car } from "@/types";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminCarsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const firestore = useFirestore();
  const carsRef = useMemoFirebase(() => firestore ? collection(firestore, "cars") : null, [firestore]);
  const { data: cars, isLoading } = useCollection<Car>(carsRef);

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedCar(null);
    setIsFormOpen(true);
  }

  const handleDelete = (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, "cars", id);
    deleteDocumentNonBlocking(docRef);
  };

  const isValidImageSrc = (src: string | undefined | null): boolean => {
    if (!src) return false;
    return src.startsWith('http') || src.startsWith('data:');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestione Auto</h1>
          <p className="text-muted-foreground">Aggiungi, modifica o elimina le auto in vendita.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleAddNew}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Aggiungi Auto
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{selectedCar ? "Modifica Auto" : "Aggiungi Nuova Auto"}</DialogTitle>
                    <DialogDescription>
                        {selectedCar ? "Modifica i dettagli dell'auto qui sotto." : "Compila i campi per aggiungere una nuova auto al tuo inventario."}
                    </DialogDescription>
                </DialogHeader>
                <CarForm car={selectedCar} onFinished={() => setIsFormOpen(false)} />
            </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Immagine</TableHead>
                <TableHead>Marca e Modello</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="hidden md:table-cell">Prezzo</TableHead>
                <TableHead className="hidden md:table-cell">Anno</TableHead>
                <TableHead><span className="sr-only">Azioni</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center">Caricamento...</TableCell>
                </TableRow>
              )}
              {!isLoading && cars?.map(car => (
                <TableRow key={car.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="Product image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={isValidImageSrc(car.images?.[0]) ? car.images[0] : "https://picsum.photos/seed/placeholder/64/64"}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {car.make} {car.model}
                    <div className="text-sm text-muted-foreground">{car.category}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={car.available ? "default" : "destructive"}>
                      {car.available ? "Disponibile" : "Venduta"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                     {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(car.price)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{car.year}</TableCell>
                   <TableCell>
                     <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(car)}>
                                <Edit className="mr-2 h-4 w-4"/>
                                Modifica
                            </DropdownMenuItem>
                             <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Elimina
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                         <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Questa azione non può essere annullata. Questo eliminerà permanentemente l'auto.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Annulla</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(car.id)}>Elimina</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
    
