import { useCallback, useEffect, useRef, useState } from 'react';

import { isEmptyObject } from '@2299899-fit-friends/helpers';
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
  const [loading, setLoading] = useState<boolean>(false);

  const totalItemsRef = useRef<number | null>(null);
  const totalPagesRef = useRef<number | null>(null);
  const nextPageRef = useRef<number>(1);

  useEffect(() => {
    nextPageRef.current = 1;
  }, [query]);

  const fetchNextPage = useCallback(async () => {
    setLoading(true);
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
        return newItems;
      });
      nextPageRef.current++;
    }
    setLoading(false);
  }, [dispatch, fetch, query]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const result: T[] = [];
    let page = 1;


    do {
      if (!isEmptyObject(query)) {
        const { entities, totalPages, totalItems } = unwrapResult(
          await dispatch(fetch({ ...query, page }))
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
      } else {
        totalPagesRef.current = 0;
      }

      page++;

      if (maxItems && result.length === maxItems) {
        break;
      }
    } while (page <= totalPagesRef.current);

    setItems(result);
    setLoading(false);
  }, [dispatch, fetch, query]);

  return {
    items,
    nextPage: nextPageRef.current,
    setItems,
    totalPages: totalPagesRef.current,
    fetchNextPage,
    fetchAll,
    loading,
  };
}
