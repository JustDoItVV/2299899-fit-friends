import classnames from 'classnames';
import { useEffect, useState } from 'react';

import { CatalogItem, useFetchPagination } from '@2299899-fit-friends/frontend-core';
import { Pagination, QueryPagination } from '@2299899-fit-friends/types';
import { AsyncThunk, AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';

type ExpandingCatalogProps = {
  fetch: AsyncThunk<Pagination<CatalogItem>, QueryPagination, AsyncThunkConfig>;
  component: React.ComponentType<{ item: CatalogItem, key?: string, additionalData?: Record<string, unknown> }>;
  query: QueryPagination;
  classNamePrefix?: string;
  preload?: boolean;
  additionalData?: Record<string, unknown>,
};

export default function ExpandingCatalog(props: ExpandingCatalogProps): JSX.Element {
  const { fetch, component: Card, query, additionalData } = props;
  const classNamePrefix = props.classNamePrefix ?? '';
  const preload = props.preload ?? false;

  const { items, nextPage, setItems, totalPages, fetchNextPage } =
    useFetchPagination<CatalogItem>(fetch, query, undefined);
  const [itemsElements, setItemsElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!preload) {
      setItems([]);
      fetchNextPage();
    }
  }, [setItems, fetchNextPage, preload, query]);

  useEffect(() => {
    const newElements = items.map((item) => (
      <li className={`${classNamePrefix}__item`} key={`${classNamePrefix}__item__${item.id}`}>
        <Card item={item} additionalData={additionalData} />
      </li>
    ));
    setItemsElements(newElements);
  }, [items, Card, classNamePrefix, additionalData]);

  const handleShowMoreButtonClick = () => {
    if (!preload) {
      fetchNextPage();
    }
  };

  const handleToTopButtonClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={classNamePrefix}>
      <ul className={`${classNamePrefix}__list`}>
        {itemsElements.length > 0
          ? itemsElements
          : <p>Записей не найдено</p>}
      </ul>
      <div className={classnames(
        `show-more ${classNamePrefix}__show-more`,
        { 'show-more__button--to-top': !itemsElements.length },
      )}>
        <button
          className={classnames(
            'btn show-more__button show-more__button--more',
            { 'show-more__button--to-top': totalPages && nextPage > totalPages },
          )}
          type="button"
          onClick={handleShowMoreButtonClick}
        >
          Показать еще
        </button>
        <button
          className={classnames(
            'btn show-more__button',
            { 'show-more__button--to-top': nextPage <= 2 },
          )}
          type="button"
          onClick={handleToTopButtonClick}
        >
          Вернуться в начало
        </button>
      </div>
    </div>
  );
}
