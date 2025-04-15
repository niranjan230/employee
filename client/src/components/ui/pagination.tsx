import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage
}: PaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

  return (
    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
      <div className="text-sm text-neutral-600 mb-2 sm:mb-0">
        Showing <span className="font-medium">{totalItems ? startItem : 0}-{endItem}</span> of <span className="font-medium">{totalItems}</span> employees
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 px-3"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
        </Button>
        
        {pageNumbers.map((pageNumber, index) => (
          <Button
            key={index}
            variant={pageNumber === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (pageNumber !== "...") {
                onPageChange(pageNumber);
              }
            }}
            disabled={pageNumber === "..."}
            className="h-8 w-8 px-0"
          >
            {pageNumber}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="h-8 px-3"
        >
          <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Helper function to generate page numbers with ellipsis for large page counts
function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pageNumbers: (number | "...")[] = [];
  
  // Always include first page
  pageNumbers.push(1);
  
  if (currentPage > 3) {
    pageNumbers.push("...");
  }
  
  // Pages around current
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  if (currentPage < totalPages - 2) {
    pageNumbers.push("...");
  }
  
  // Always include last page if there's more than one page
  if (totalPages > 1) {
    pageNumbers.push(totalPages);
  }
  
  return pageNumbers;
}
