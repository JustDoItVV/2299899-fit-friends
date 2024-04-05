import { useCallback, useEffect, useRef, useState } from 'react';

import {
    selectCatalogTotalPages, useAppDispatch, useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { Pagination, QueryPagination, Training, User } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';
import { AsyncThunk, AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';

type ExpandingCatalogProps<T> = {
  fetch: AsyncThunk<Pagination<T>, string, AsyncThunkConfig>;
  component: React.ComponentType<{ item: Training | User, key?: string }>;
  classNameList: string;
  queryParams: QueryPagination;
};

export default function ExpandingCatalog<T extends Training | User>(props: ExpandingCatalogProps<T>): JSX.Element {
  const { fetch, component: Card, classNameList, queryParams } = props;
  const dispatch = useAppDispatch();
  const totalPages = useAppSelector(selectCatalogTotalPages);
  const [catalogCards, setCatalogCards] = useState<JSX.Element[]>([]);
  const currentPageRef = useRef<number>(1);

  const getQueryString = (query: QueryPagination): string => {
    const queryStrings = Object.keys(query).map((key) => `${key}=${query[key as keyof QueryPagination]}`);
    return queryStrings.join('&');
  };

  const fetchPageItems = useCallback(async () => {
    const { entities: pageItems, totalPages: totalPagesCount } =
      unwrapResult(await dispatch(fetch(getQueryString(queryParams))));
    const newTrainingCatalogCards: JSX.Element[] = [];

    if (totalPages !== totalPagesCount) {
      setCatalogCards([]);
      currentPageRef.current = 1;
    } else {
      if (currentPageRef.current <= totalPages) {
        pageItems.forEach((item) => newTrainingCatalogCards.push(
          <Card item={item} key={`catalog_item_${item.id}`} />
        ));
        setCatalogCards(((oldValue) => [...oldValue, ...newTrainingCatalogCards]));
        currentPageRef.current++;
      }
    }

    queryParams.page = currentPageRef.current;
  }, [dispatch, Card, fetch, totalPages, queryParams]);

  useEffect(() => {
    fetchPageItems();
  }, [fetchPageItems]);

  const handleShowMoreButtonClick = () => {
    fetchPageItems();
  };

  const handleToTopButtonClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ul className={classNameList}>
        {catalogCards.length > 0
          ? catalogCards
          : <p>Записей не найдено</p>}
      </ul>
      <div className={`show-more my-trainings__show-more ${!catalogCards.length && 'show-more__button--to-top'}`}>
        <button
          className={`btn show-more__button show-more__button--more ${currentPageRef.current > totalPages && 'show-more__button--to-top'}`}
          type="button"
          onClick={handleShowMoreButtonClick}
        >
          Показать еще
        </button>
        <button
          className={`btn show-more__button show-more__button--more ${currentPageRef.current <= totalPages && 'show-more__button--to-top'}`}
          type="button"
          onClick={handleToTopButtonClick}
        >
          Вернуться в начало
        </button>
      </div>
    </>
  );
}
