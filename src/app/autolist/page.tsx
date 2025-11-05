
'use client';
import { useState, useMemo } from 'react';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { CarFilters } from '@/components/autolist/car-filters';
import { CarGrid } from '@/components/autolist/car-grid';
import { CarSort } from '@/components/autolist/car-sort';
import type { Car } from '@/types';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Filter, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { carConverter } from '@/firebase/converters/carConverter';

export default function AutoListPage() {
  const [filters, setFilters] = useState({
    category: [] as string[],
    make: [] as string[],
    price: [0, 100000],
    year: [2010, new Date().getFullYear()],
    mileage: [0, 200000],
    fuelType: [] as string[],
    transmission: [] as string[],
    search: '',
  });

  const [sort, setSort] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const firestore = useFirestore();
  const carsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'cars').withConverter(carConverter) : null),
    [firestore]
  );
  const { data: allCars, isLoading } = useCollection<Car>(carsRef);

  const filteredAndSortedCars = useMemo(() => {
    if (!allCars) return [];

    let filtered = allCars.filter((car: Car) => {
      const { category, make, price, year, mileage, fuelType, transmission, search } = filters;
      
      if (category.length > 0 && !category.includes(car.category)) return false;
      if (make.length > 0 && !make.includes(car.make)) return false;
      if (price && (car.price < price[0] || car.price > price[1])) return false;
      if (year && (car.year < year[0] || car.year > year[1])) return false;
      if (mileage && (car.mileage < mileage[0] || car.mileage > mileage[1])) return false;
      if (fuelType.length > 0 && !fuelType.includes(car.fuelType)) return false;
      if (transmission.length > 0 && !transmission.includes(car.transmission)) return false;
      if (search && !(car.make.toLowerCase().includes(search.toLowerCase()) || car.model.toLowerCase().includes(search.toLowerCase()))) return false;
      
      return true;
    });

    switch (sort) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'year-desc':
            filtered.sort((a, b) => b.year - a.year);
            break;
        case 'year-asc':
            filtered.sort((a, b) => a.year - b.year);
            break;
        case 'mileage-asc':
            filtered.sort((a, b) => a.mileage - b.mileage);
            break;
        case 'mileage-desc':
            filtered.sort((a, b) => b.mileage - a.mileage);
            break;
        case 'featured':
        default:
             filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
    }
    
    return filtered;
  }, [filters, sort, allCars]);
  
  const totalPages = Math.ceil(filteredAndSortedCars.length / itemsPerPage);
  const paginatedCars = filteredAndSortedCars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <Header />
      <main className="flex-grow container py-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Le Nostre Auto</h1>
            <p className="mt-2 text-muted-foreground">Esplora il nostro inventario completo. Usa i filtri per trovare l'auto perfetta per te.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <CarFilters filters={filters} onFilterChange={handleFilterChange} />
          </aside>
          <section className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                    Trovate <span className="font-bold text-foreground">{filteredAndSortedCars.length}</span> auto
                </p>
                 <div className="flex items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="lg:hidden">
                                <Filter className="mr-2 h-4 w-4" />
                                Filtri
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0">
                            <CarFilters filters={filters} onFilterChange={handleFilterChange} />
                        </SheetContent>
                    </Sheet>
                    <CarSort sort={sort} onSortChange={handleSortChange} />
                </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <CarGrid cars={paginatedCars} totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
