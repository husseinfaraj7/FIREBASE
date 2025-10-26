'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CarSort({ sort, onSortChange }: { sort: string, onSortChange: (sort: string) => void }) {
  return (
    <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordina per" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="featured">Rilevanza</SelectItem>
            <SelectItem value="price-asc">Prezzo: crescente</SelectItem>
            <SelectItem value="price-desc">Prezzo: decrescente</SelectItem>
            <SelectItem value="year-desc">Anno: più recenti</SelectItem>
            <SelectItem value="year-asc">Anno: meno recenti</SelectItem>
            <SelectItem value="mileage-asc">Chilometri: crescenti</SelectItem>
            <SelectItem value="mileage-desc">Chilometri: decrescenti</SelectItem>
        </SelectContent>
    </Select>
  );
}
