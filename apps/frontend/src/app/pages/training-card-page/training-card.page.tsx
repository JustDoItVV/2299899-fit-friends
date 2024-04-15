import './training-card.page.css';

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import {
    fetchBalanceCatalog, fetchReviews, fetchTraining, redirectToRoute, selectBalance,
    selectCurrentUser, selectReviews, selectTraining, selectTrainingDataIsLoading, useAppDispatch,
    useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, UserRole } from '@2299899-fit-friends/types';

import AsideLeftBlock from '../../components/aside-left-block/aside-left-block';
import CardReview from '../../components/cards/card-review/card-review';
import CardTrainingInfo from '../../components/cards/card-training-info/card-training-info';
import Header from '../../components/header/header';
import Loading from '../../components/loading/loading';
import PopupReview from '../../components/popups/popup-review/popup-review';
import NotFoundPage from '../not-found-page/not-found.page';

export default function TrainingCardPage(): JSX.Element {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const reviews = useAppSelector(selectReviews);
  const training = useAppSelector(selectTraining);
  const balance = useAppSelector(selectBalance);
  const isLoading = useAppSelector(selectTrainingDataIsLoading);

  const [reviewsElements, setReviewsElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (currentUser && training) {
      if (currentUser?.role === UserRole.Trainer && training?.userId !== currentUser.id) {
        dispatch(redirectToRoute(`/${FrontendRoute.Account}`));
      }
    }
  }, [training, dispatch, currentUser]);

  useEffect(() => {
    if (id) {
      dispatch(fetchReviews(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchTraining(id));
      if (currentUser?.role === UserRole.User) {
        dispatch(fetchBalanceCatalog({ trainingId: id }))
      }
    }
  }, [dispatch, id, reviews, currentUser]);

  useEffect(() => {
    setReviewsElements(reviews.map((review, index) => (
      <li className="reviews-side-bar__item" key={`review_item_${index}`}>
        <CardReview item={review}/>
      </li>
    )));
  }, [reviews]);

  if (isLoading) {
    return <Loading />
  }

  if (!training) {
    return <NotFoundPage />
  }

  return (
    <div className="wrapper">
      <Helmet><title>Карточка тренировки — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Main} />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Карточка тренировки</h1>
              <AsideLeftBlock className='reviews-side-bar' backButtonPath={`/${FrontendRoute.Trainings}`}>
                <h2 className="reviews-side-bar__title">Отзывы</h2>
                <ul className="reviews-side-bar__list">
                  {reviewsElements.length > 0 ? reviewsElements : 'Нет отзывов'}
                </ul>
                <PopupReview trainingId={id} trigger={
                  <button
                    className="btn btn--medium reviews-side-bar__button"
                    type="button"
                    disabled={!balance || currentUser?.role === UserRole.Trainer || !!reviews.find((review) => review.userId === currentUser?.id)}
                  >
                    {
                      reviews.find((review) => review.userId === currentUser?.id)
                      ? 'Отзыв оставлен'
                      : 'Оставить отзыв'
                    }
                  </button>
                } />
              </AsideLeftBlock>
              <CardTrainingInfo id={id} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
