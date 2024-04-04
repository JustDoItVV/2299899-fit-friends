import { useCallback, useEffect, useRef, useState } from 'react';

import { State, useAppDispatch, useAppSelector } from '@2299899-fit-friends/frontend-core';
import { NameSpace, Pagination, QueryPagination, Training } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';
import { AsyncThunk, AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';

type ExpandingCatalogProps = {
  fetch: AsyncThunk<Pagination<Training>, string, AsyncThunkConfig>;
  selector: (state: Pick<State, NameSpace>) => number;
  component: React.ComponentType<{ item: Training, key?: string }>;
  keyPrefix: string;
  classNameList: string;
  queryParams: QueryPagination;
};

export default function ExpandingCatalog(props: ExpandingCatalogProps): JSX.Element {
  const { fetch, selector, component: Card, keyPrefix, classNameList, queryParams } = props;
  const dispatch = useAppDispatch();
  // const [totalPages, setTotalPages] = useState<number>(1);
  const totalPages = useAppSelector(selector);
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
      // setTotalPages(totalPagesCount);
      currentPageRef.current = 1;
    } else {
      if (currentPageRef.current <= totalPages) {
        pageItems.forEach((item) => newTrainingCatalogCards.push(
          <Card item={item} key={`${keyPrefix}_${item.id}`} />
        ));
        setCatalogCards(((oldValue) => [...oldValue, ...newTrainingCatalogCards]));
        currentPageRef.current++;
      }
    }

    queryParams.page = currentPageRef.current;
  }, [dispatch, Card, fetch, keyPrefix, totalPages, queryParams]);

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
