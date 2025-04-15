import { useState } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination({ 
  initialPage = 1, 
  initialLimit = 10 
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const resetPagination = () => {
    setPage(initialPage);
  };

  const changeItemsPerPage = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing items per page
  };

  return {
    page,
    setPage,
    limit,
    setLimit: changeItemsPerPage,
    resetPagination,
  };
}
