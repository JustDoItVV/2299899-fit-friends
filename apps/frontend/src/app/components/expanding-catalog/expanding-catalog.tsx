import { useCallback, useEffect, useRef, useState } from 'react';

import { CatalogItem, useAppDispatch } from '@2299899-fit-friends/frontend-core';
import { Pagination, QueryPagination } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';
import { AsyncThunk, AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';

type ExpandingCatalogProps<T> = {
  fetch: AsyncThunk<Pagination<T>, QueryPagination, AsyncThunkConfig>;
  component: React.ComponentType<{ item: CatalogItem, key?: string }>;
  classNameList: string;
  queryParams: QueryPagination;
};

export default function ExpandingCatalog<T extends CatalogItem>(props: ExpandingCatalogProps<T>): JSX.Element {
  const { fetch, component: Card, classNameList, queryParams } = props;
  const dispatch = useAppDispatch();
  const [catalogCards, setCatalogCards] = useState<JSX.Element[]>([]);
  const currentPageRef = useRef<number>(1);

  const fetchPageItems = useCallback(async () => {
    const { entities: pageItems, totalItems: totalItemsCount } =
      unwrapResult(await dispatch(fetch(queryParams)));
    const newTrainingCatalogCards: JSX.Element[] = [];

    if (1000 !== totalItemsCount) {
      setCatalogCards([]);
      currentPageRef.current = 1;
    } else {
      if (currentPageRef.current <= 1000) {
        pageItems.forEach((item) => newTrainingCatalogCards.push(
          <Card item={item} key={`catalog_item_${item.id}`} />
        ));
        setCatalogCards(((oldValue) => [...oldValue, ...newTrainingCatalogCards]));
        currentPageRef.current++;
      }
    }

    queryParams.page = currentPageRef.current;
  }, [dispatch, Card, fetch, queryParams]);

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
          className={`btn show-more__button show-more__button--more ${currentPageRef.current > 1000 && 'show-more__button--to-top'}`}
          type="button"
          onClick={handleShowMoreButtonClick}
        >
          Показать еще
        </button>
        <button
          className={`btn show-more__button show-more__button--more ${currentPageRef.current <= 1000 && 'show-more__button--to-top'}`}
          type="button"
          onClick={handleToTopButtonClick}
        >
          Вернуться в начало
        </button>
      </div>
    </>
  );
}
