import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactPlayer from 'react-player/lazy';
import { useParams } from 'react-router-dom';

import {
    fetchBalanceCatalog, fetchReviews, fetchTraining, fetchTrainingBackgroundPicture,
    fetchTrainingVideo, fetchUserAction, fetchUserAvatar, selectBalance, selectReviews,
    selectTraining, updateBalance, useAppDispatch, useAppSelector, useFetchFileUrl
} from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, User } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';

import AsideLeftBlock from '../../components/aside-left-block/aside-left-block';
import CardReview from '../../components/cards/card-review/card-review';
import Header from '../../components/header/header';
import PopupBuy from '../../components/popups/popup-buy/popup-buy';
import PopupReview from '../../components/popups/popup-review/popup-review';

export default function TrainingCardPage(): JSX.Element {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const training = useAppSelector(selectTraining);
  const reviews = useAppSelector(selectReviews);
  const balance = useAppSelector(selectBalance);
  const [reviewsElements, setReviewsElements] = useState<JSX.Element[]>([]);
  const [trainer, setTrainer] = useState<User | null>(null);
  const avatarUrl = useFetchFileUrl(fetchUserAvatar, { id: training?.userId }, 'img/content/placeholder.png', [trainer]);
  const videoUrl = useFetchFileUrl(fetchTrainingVideo, { id: training?.id }, 'img/content/placeholder.png', [training]);
  const thumbnailUrl = useFetchFileUrl(fetchTrainingBackgroundPicture, { id: training?.id }, 'img/content/placeholder.png', [training]);
  const [isTrainingActive, setIsTrainingActive] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchReviews(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchTraining(id));
      dispatch(fetchBalanceCatalog({ trainingId: id }))
    }
  }, [dispatch, id, reviews]);

  useEffect(() => {
    const fetch = async () => {
      if (training?.userId) {
        const data = unwrapResult(
          await dispatch(fetchUserAction(training?.userId))
        );
        setTrainer(data);
      }
    };

    fetch();
  }, [dispatch, training]);

  useEffect(() => {
    setReviewsElements(reviews.map((review, index) => (
      <li className="reviews-side-bar__item" key={`review_item_${index}`}>
        <CardReview item={review}/>
      </li>
    )));
  }, [reviews]);

  const handleStartTrainingButtonClick = () => {
    if (training?.id) {
      dispatch(updateBalance({ trainingId: training.id, available: balance.available - 1 }));
      setIsTrainingActive(true);
    }
  };

  const handleStopTrainingButtonClick = () => {
    setIsTrainingActive(false);
  };

  const videoPreviewElement = (
    <picture>
      <img src={thumbnailUrl} alt='videoPreview'/>
      <button
        className="training-video__play-button btn-reset"
        disabled={!isTrainingActive}
      >
        <svg width={18} height={30} aria-hidden="true">
          <use xlinkHref="#icon-arrow" />
        </svg>
      </button>
    </picture>
  );

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
                  >
                    Оставить отзыв
                  </button>
                } />
              </AsideLeftBlock>
              <div className="training-card">
                <div className="training-info">
                  <h2 className="visually-hidden">Информация о тренировке</h2>
                  <div className="training-info__header">
                    <div className="training-info__coach">
                      <div className="training-info__photo">
                        <picture>
                          <img
                            src={avatarUrl}
                            width={64}
                            height={64}
                            alt={trainer?.name}
                          />
                        </picture>
                      </div>
                      <div className="training-info__coach-info">
                        <span className="training-info__label">Тренер</span>
                        <span className="training-info__name">{trainer?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="training-info__main-content">
                    <form action="#" method="get">
                      <div className="training-info__form-wrapper">
                        <div className="training-info__info-wrapper">
                          <div className="training-info__input training-info__input--training">
                            <label>
                              <span className="training-info__label">
                                Название тренировки
                              </span>
                              <input
                                type="text"
                                name="training"
                                defaultValue={training?.title}
                                disabled
                              />
                            </label>
                            <div className="training-info__error">Обязательное поле</div>
                          </div>
                          <div className="training-info__textarea">
                            <label>
                              <span className="training-info__label">
                                Описание тренировки
                              </span>
                              <textarea
                                name="description"
                                disabled
                                defaultValue={training?.description}
                              />
                            </label>
                          </div>
                        </div>
                        <div className="training-info__rating-wrapper">
                          <div className="training-info__input training-info__input--rating">
                            <label>
                              <span className="training-info__label">Рейтинг</span>
                              <span className="training-info__rating-icon">
                                <svg width={18} height={18} aria-hidden="true">
                                  <use xlinkHref="#icon-star" />
                                </svg>
                              </span>
                              <input
                                type="number"
                                name="rating"
                                value={
                                  training?.rating && (training?.rating - Math.floor(training?.rating))
                                  ? training?.rating.toFixed(1)
                                  : training?.rating ?? 0
                                }
                                disabled
                              />
                            </label>
                          </div>
                          <ul className="training-info__list">
                            <li className="training-info__item">
                              <div className="hashtag hashtag--white">
                                <span>#{training?.type}</span>
                              </div>
                            </li>
                            <li className="training-info__item">
                              <div className="hashtag hashtag--white">
                                <span>#{training?.gender.split(' ').join('_')}</span>
                              </div>
                            </li>
                            <li className="training-info__item">
                              <div className="hashtag hashtag--white">
                                <span>#{training?.calories}ккал</span>
                              </div>
                            </li>
                            <li className="training-info__item">
                              <div className="hashtag hashtag--white">
                                <span>#{training?.duration.split(' ').join('_')}</span>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="training-info__price-wrapper">
                          <div className="training-info__input training-info__input--price">
                            <label>
                              <span className="training-info__label">Стоимость</span>
                              <input
                                type="text"
                                name="price"
                                value={`${training?.price} ₽`}
                                disabled
                              />
                            </label>
                            <div className="training-info__error">Введите число</div>
                          </div>
                          <PopupBuy trainingId={id} trainingTitle={training?.title} trainingPrice={training?.price} trigger={
                            <button
                              className="btn training-info__buy"
                              type="button"
                              disabled={balance && !!balance.available}
                            >
                              Купить
                            </button>
                          } />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="training-video">
                  <h2 className="training-video__title">Видео</h2>
                  <div className="training-video__video">
                    <div className="training-video__thumbnail">
                      <ReactPlayer
                        url={videoUrl}
                        controls={isTrainingActive}
                        light={true}
                        width='100%'
                        height='100%'
                        playIcon={videoPreviewElement}
                        onEnded={handleStopTrainingButtonClick}
                      />
                    </div>
                  </div>
                  <div className="training-video__buttons-wrapper">
                    {
                      isTrainingActive
                      ?
                      <button
                        className="btn training-video__button training-video__button--stop"
                        type="button"
                        onClick={handleStopTrainingButtonClick}
                      >
                        Закончить
                      </button>
                      :
                      <button
                        className="btn training-video__button training-video__button--start"
                        type="button"
                        disabled={balance && !balance.available}
                        onClick={handleStartTrainingButtonClick}
                      >
                        Приступить
                      </button>
                    }
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
