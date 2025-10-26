'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { CAR_CATEGORIES, CAR_MAKES, FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/constants"
import { Search, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CarFilters({ filters, onFilterChange }: { filters: any, onFilterChange: (filters: any) => void }) {
  const handleMultiCheckboxChange = (filterName: string, value: string) => {
    const currentValues = filters[filterName] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange({ ...filters, [filterName]: newValues });
  };

  const handleSliderChange = (filterName: string, newValue: number[]) => {
    onFilterChange({ ...filters, [filterName]: newValue });
  };
  
  const handleReset = () => {
    onFilterChange({
        category: [],
        make: [],
        price: [0, 100000],
        year: [2010, new Date().getFullYear()],
        mileage: [0, 200000],
        fuelType: [],
        transmission: [],
        search: '',
    })
  }
  
  const activeFilterCount = Object.values(filters).reduce((count: number, value: any) => {
    if (Array.isArray(value) && value.length > 0) return count + value.length;
    if (typeof value === 'string' && value) return count + 1;
    // Don't count default slider values
    if (Array.isArray(value) && (value[0] > 0 || value[1] < 100000)) return count + 1;
    return count;
  }, 0);

  return (
    <Card className="sticky top-20 h-[calc(100vh-6rem)] lg:h-auto">
      <ScrollArea className="h-full">
        <CardContent className="p-4">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filtri</h3>
                {activeFilterCount > 0 && 
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                        <X className="w-4 h-4 mr-1"/>
                        Reset
                    </Button>
                }
            </div>
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Cerca per marca o modello..."
                    className="pl-9"
                    value={filters.search}
                    onChange={e => onFilterChange({ ...filters, search: e.target.value })}
                />
            </div>

            <Accordion type="multiple" defaultValue={['category', 'make', 'price']} className="w-full">
                <AccordionItem value="category">
                    <AccordionTrigger>Categoria</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                        {CAR_CATEGORIES.map(cat => (
                            <div key={cat} className="flex items-center space-x-2">
                                <Checkbox id={`cat-${cat}`} checked={filters.category.includes(cat)} onCheckedChange={() => handleMultiCheckboxChange('category', cat)} />
                                <Label htmlFor={`cat-${cat}`} className="font-normal">{cat}</Label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="make">
                    <AccordionTrigger>Marca</AccordionTrigger>
                    <AccordionContent>
                        {Object.entries(CAR_MAKES).map(([region, makes]) => (
                            <div key={region} className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">{region}</h4>
                                <div className="space-y-2">
                                    {makes.map(make => (
                                        <div key={make} className="flex items-center space-x-2">
                                            <Checkbox id={`make-${make}`} checked={filters.make.includes(make)} onCheckedChange={() => handleMultiCheckboxChange('make', make)} />
                                            <Label htmlFor={`make-${make}`} className="font-normal">{make}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price">
                    <AccordionTrigger>Prezzo</AccordionTrigger>
                    <AccordionContent className="px-1 pt-2">
                        <Slider
                            min={0}
                            max={100000}
                            step={1000}
                            value={filters.price}
                            onValueChange={newValue => handleSliderChange('price', newValue)}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(filters.price[0])}</span>
                            <span>{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(filters.price[1])}</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                
                 <AccordionItem value="year">
                    <AccordionTrigger>Anno</AccordionTrigger>
                    <AccordionContent className="px-1 pt-2">
                        <Slider
                            min={2010}
                            max={new Date().getFullYear()}
                            step={1}
                            value={filters.year}
                            onValueChange={newValue => handleSliderChange('year', newValue)}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>{filters.year[0]}</span>
                            <span>{filters.year[1]}</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="mileage">
                    <AccordionTrigger>Chilometraggio</AccordionTrigger>
                    <AccordionContent className="px-1 pt-2">
                        <Slider
                            min={0}
                            max={200000}
                            step={5000}
                            value={filters.mileage}
                            onValueChange={newValue => handleSliderChange('mileage', newValue)}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                             <span>{new Intl.NumberFormat('it-IT').format(filters.mileage[0])} km</span>
                            <span>{new Intl.NumberFormat('it-IT').format(filters.mileage[1])} km</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fuelType">
                    <AccordionTrigger>Alimentazione</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                        {FUEL_TYPES.map(fuel => (
                            <div key={fuel} className="flex items-center space-x-2">
                                <Checkbox id={`fuel-${fuel}`} checked={filters.fuelType.includes(fuel)} onCheckedChange={() => handleMultiCheckboxChange('fuelType', fuel)} />
                                <Label htmlFor={`fuel-${fuel}`} className="font-normal">{fuel}</Label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="transmission">
                    <AccordionTrigger>Cambio</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                         {TRANSMISSION_TYPES.map(trans => (
                            <div key={trans} className="flex items-center space-x-2">
                                <Checkbox id={`trans-${trans}`} checked={filters.transmission.includes(trans)} onCheckedChange={() => handleMultiCheckboxChange('transmission', trans)} />
                                <Label htmlFor={`trans-${trans}`} className="font-normal">{trans}</Label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </CardContent>
        </ScrollArea>
    </Card>
  )
}
