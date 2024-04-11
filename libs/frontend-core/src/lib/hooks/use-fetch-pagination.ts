import { useCallback, useEffect, useRef, useState } from 'react';

import { Pagination, QueryPagination } from '@2299899-fit-friends/types';
import { AsyncThunk, unwrapResult } from '@reduxjs/toolkit';

import { CatalogItem } from '../storage/types/catalog-item.type';
import { useAppDispatch } from './use-app-dispatch';

export function useFetchPagination<T extends CatalogItem>(
  fetch: AsyncThunk<Pagination<T>, QueryPagination, Record<string, unknown>>,
  query: QueryPagination,
  maxItems?: number | undefined,
) {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<T[]>([]);
  const totalItemsRef = useRef<number | null>(null);
  const totalPagesRef = useRef<number | null>(null);
  const nextPageRef = useRef<number>(1);

  useEffect(() => {
    nextPageRef.current = 1;
  }, [query]);

  const fetchNextPage = useCallback(async () => {
    const { entities, totalPages, currentPage, totalItems } = unwrapResult(
      await dispatch(fetch({ ...query, page: nextPageRef.current }))
    );

    if (nextPageRef.current !== currentPage) {
      nextPageRef.current = currentPage;
    }

    if (!totalPagesRef.current || totalPagesRef.current !== totalPages) {
      totalPagesRef.current = totalPages;
    }

    if (!totalPagesRef.current || totalItemsRef.current !== totalItems) {
      totalItemsRef.current = totalItems;
    }

    if (nextPageRef.current <= totalPages) {
      setItems((old) => {
        const newItems = [...old];
        entities.forEach((entity) => {
          if (!newItems.some((item) => item.id === entity.id)) {
            newItems.push(entity);
          }
        });
        return newItems
      });
      nextPageRef.current++;
    }
  }, [dispatch, fetch, query]);

  const fetchAll = useCallback(async () => {
    const result = [];
    let page = 1;

    do {
      const { entities, totalPages, totalItems } = unwrapResult(
        await dispatch(fetch(query))
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

      page++;

      if (maxItems && result.length === maxItems) {
        break;
      }
    } while (page <= totalPagesRef.current);

    setItems(result);
  }, [dispatch, fetch, query]);

  return {
    items,
    nextPage: nextPageRef.current,
    setItems,
    totalPages: totalPagesRef.current,
    fetchNextPage,
    fetchAll,
  };
}
