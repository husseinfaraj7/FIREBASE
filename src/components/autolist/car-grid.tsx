'use client';

import { CarCard } from "@/components/car-card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import type { Car } from "@/types";
import { Frown } from "lucide-react";

type CarGridProps = {
  cars: Car[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export function CarGrid({ cars, totalPages, currentPage, onPageChange }: CarGridProps) {
  const handlePrevious = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage > 1) {
        onPageChange(currentPage - 1);
    }
  }

  const handleNext = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
    }
  }

  const handlePageClick = (e: React.MouseEvent<HTMLAnchorElement>, page: number) => {
    e.preventDefault();
    onPageChange(page);
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 3;
    const totalPagesToShow = Math.min(totalPages, maxPagesToShow);

    let startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);
    
    if (endPage - startPage + 1 < totalPagesToShow) {
        startPage = Math.max(1, endPage - totalPagesToShow + 1);
    }


    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push(-1); // Represents ellipsis
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push(-1);
        pageNumbers.push(totalPages);
    }


    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={handlePrevious} aria-disabled={currentPage === 1} />
          </PaginationItem>
          {pageNumbers.map((p, index) => (
            <PaginationItem key={`${p}-${index}`} className="hidden sm:block">
              {p === -1 ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink href="#" onClick={(e) => handlePageClick(e, p)} isActive={currentPage === p}>
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" onClick={handleNext} aria-disabled={currentPage === totalPages} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  if (cars.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-96 border border-dashed rounded-lg">
            <Frown className="w-16 h-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Nessuna auto trovata</h3>
            <p className="mt-2 text-sm text-muted-foreground">Prova a modificare i filtri di ricerca.</p>
        </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      <div className="mt-8">
        {renderPagination()}
      </div>
    </div>
  );
}
