import { useCallback, useEffect, useState } from 'react';

import { fetchTrainerCatalog, useAppDispatch } from '@2299899-fit-friends/frontend-core';
import { QueryPagination } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';

import TrainingCatalogCard from '../training-catalog-card/training-catalog-card';

type TrainingCatalogProps = {
  queryParams: QueryPagination;
};

export default function TrainingCatalog({ queryParams }: TrainingCatalogProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [trainingCatalogCards, setTrainingCatalogCards] = useState<JSX.Element[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchPageItems = useCallback(async () => {
    const { entities: pageItems, totalPages: totalPagesCount } = unwrapResult(await dispatch(fetchTrainerCatalog(getQueryString(queryParams))))
    const newTrainingCatalogCards: JSX.Element[] = [];

    if (totalPagesCount !== totalPages) {
      setTotalPages(totalPagesCount);
    } else {
      if (queryParams.page && queryParams.page <= totalPages) {
        pageItems.forEach((training) => newTrainingCatalogCards.push(<TrainingCatalogCard training={training} key={`training_card_${training.id}`} />));
        setTrainingCatalogCards(((oldValue) => [...oldValue, ...newTrainingCatalogCards]));
        queryParams.page++;
      }
    }
  }, [dispatch, totalPages, queryParams]);

  const getQueryString = (query: QueryPagination): string => {
    const queryStrings = Object.keys(query).map((key) => `${key}=${query[key as keyof QueryPagination]}`);
    return queryStrings.join('&');
  };

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
    <div className="inner-page__content">
      <div className="my-trainings">
        <ul className="my-trainings__list">
          {trainingCatalogCards.length > 0
            ? trainingCatalogCards
            : <p>No trainings</p>}
        </ul>
        <div className={`show-more my-trainings__show-more ${!trainingCatalogCards.length && 'show-more__button--to-top'}`}>
          <button
            className={`btn show-more__button show-more__button--more ${queryParams.page && queryParams.page > totalPages && 'show-more__button--to-top'}`}
            type="button"
            onClick={handleShowMoreButtonClick}
          >
            Показать еще
          </button>
          <button
            className={`btn show-more__button show-more__button--more ${queryParams.page && queryParams.page <= totalPages && 'show-more__button--to-top'}`}
            type="button"
            onClick={handleToTopButtonClick}
          >
            Вернуться в начало
          </button>
        </div>
      </div>
    </div>
  );
}
