import {
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { useState } from "react";
interface PaginationProps {
  hasPrev: boolean;
  hasNext: boolean;
  onFirst(): void;
  onPrev(): void;
  onNext(): void;
}

interface CursorPaginationProps extends PaginationProps {
  currentPage: number;
}

interface UseCursorPaginationResult<TData, TError>
  extends Omit<UseInfiniteQueryResult<InfiniteData<TData, TError>>, "data"> {
  data: TData | undefined;
  pagination: CursorPaginationProps;
}

export function useCursorPagination<TData, TError>(
  query: UseInfiniteQueryResult<InfiniteData<TData, TError>>,
): UseCursorPaginationResult<TData, TError> {
  const [currentPage, setCurrentPage] = useState(0);

  return {
    ...query,
    data: query.data?.pages[currentPage],
    pagination: {
      onFirst: () => setCurrentPage(0),
      onNext: () => {
        if (!query.data || query.isFetchingNextPage) {
          return;
        }

        if (currentPage >= query.data.pages.length - 1) {
          void query.fetchNextPage();
        }

        setCurrentPage(currentPage + 1);
      },
      onPrev: () => {
        setCurrentPage(Math.max(currentPage - 1, 0));
      },
      hasNext:
        !query.isFetchingNextPage &&
        (currentPage < (query.data?.pages.length ?? 0) - 1 ||
          !!query.hasNextPage),
      hasPrev: currentPage !== 0,
      currentPage,
    },
  } as UseCursorPaginationResult<TData, TError>;
}
