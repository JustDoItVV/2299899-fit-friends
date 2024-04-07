import { useCallback, useRef, useState } from 'react';

import { Pagination, QueryPagination } from '@2299899-fit-friends/types';
import { AsyncThunk, unwrapResult } from '@reduxjs/toolkit';

import { CatalogItem } from '../storage/types/catalog-item.type';
import { useAppDispatch } from './';

export function useFetchPagination<T extends CatalogItem | JSX.Element>(
  fetch: AsyncThunk<Pagination<T>, QueryPagination, Record<string, unknown>>,
  queryParams: QueryPagination,
  maxItems?: number | undefined,
) {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<T[]>([]);
  const totalItemsRef = useRef<number | null>(null);
  const totalPagesRef = useRef<number | null>(null);
  const nextPage = useRef<number>(1);

  const fetchNextPage = useCallback(async () => {
    queryParams.page = nextPage.current;
    const { entities, totalPages, totalItems } = unwrapResult(
      await dispatch(fetch(queryParams))
    );

    if (totalItemsRef.current !== totalItems) {
      totalItemsRef.current = totalItems;
      totalPagesRef.current = totalPages;
      nextPage.current = 1;
      setItems([]);
    } else if (nextPage.current < totalPages) {
      nextPage.current++;
      setItems((old) => [...old, ...entities]);
    }
  }, [dispatch, fetch, queryParams]);

  const fetchAll = useCallback(async () => {
    const result = [];
    nextPage.current = 1;
    queryParams.page = nextPage.current;

    do {
      const { entities, totalPages, totalItems } = unwrapResult(
        await dispatch(fetch(queryParams))
      );

      if (!totalPagesRef.current || !totalItemsRef.current) {
        totalPagesRef.current = totalPages;
        totalItemsRef.current = totalItems;
      }

      entities.forEach((item) => {
        if (maxItems) {
          if (result.length < maxItems) {
            result.push(item);
          }
        } else {
          result.push(item);
        }
      });

      nextPage.current++;

      if (maxItems && result.length === maxItems) {
        break;
      }
    } while (nextPage.current <= totalPagesRef.current);

    setItems(result);
  }, [dispatch, fetch, queryParams]);

  return { items, fetchNextPage, fetchAll };
}
