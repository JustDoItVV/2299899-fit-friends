import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { fetchTrainerCatalog, useAppDispatch } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';

import Header from '../../components/header/header';
import TrainingCatalogCard from '../../components/training-catalog-card/training-catalog-card';
import TrainingsQueryForm from '../../components/trainings-query-form/trainings-query-form';

export default function AccountTrainingsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const [trainingCatalogCards, setTrainingCatalogCards] = useState<JSX.Element[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const currentPage = useRef<number>(1);

  const fetchPageItems = useCallback(async () => {
    const { entities: pageItems, totalPages: totalPagesCount } = unwrapResult(await dispatch(fetchTrainerCatalog(currentPage.current)))
    const newTrainingCatalogCards: JSX.Element[] = [];

    if (totalPagesCount !== totalPages) {
      setTotalPages(totalPagesCount);
    } else {
      if (currentPage.current <= totalPages) {
        pageItems.forEach((training) => newTrainingCatalogCards.push(<TrainingCatalogCard training={training} key={`training_card_${training.id}`} />));
        setTrainingCatalogCards(((oldValue) => [...oldValue, ...newTrainingCatalogCards]));
        currentPage.current++;
      }
    }
  }, [dispatch, totalPages]);

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
    <div className="wrapper">
      <Helmet><title>Личный кабинет — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Account} />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Мои тренировки</h1>
              <TrainingsQueryForm />
              <div className="inner-page__content">
                <div className="my-trainings">
                  <ul className="my-trainings__list">
                    {trainingCatalogCards.length > 0
                      ? trainingCatalogCards
                      : <p>No trainings</p>}
                  </ul>
                  <div className={`show-more my-trainings__show-more ${!trainingCatalogCards.length && 'show-more__button--to-top'}`}>
                    <button
                      className={`btn show-more__button show-more__button--more ${currentPage.current > totalPages && 'show-more__button--to-top'}`}
                      type="button"
                      onClick={handleShowMoreButtonClick}
                    >
                      Показать еще
                    </button>
                    <button
                      className={`btn show-more__button show-more__button--more ${currentPage.current <= totalPages && 'show-more__button--to-top'}`}
                      type="button"
                      onClick={handleToTopButtonClick}
                    >
                      Вернуться в начало
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
