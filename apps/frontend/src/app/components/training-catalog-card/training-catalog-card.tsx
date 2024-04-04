import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchTrainingBackgroundPicture, useAppDispatch } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, Training } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';

type TrainingCatalogCardProps = {
  training: Training;
};

export default memo(function TrainingCatalogCard({ training }: TrainingCatalogCardProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchAvatar = async () => {
      const image = unwrapResult(await dispatch(fetchTrainingBackgroundPicture(training.id || '')));
      setImageUrl(image);
    };

    fetchAvatar();
  }, [dispatch, training]);

  return (
    <li className="my-trainings__item">
      <div className="thumbnail-training">
        <div className="thumbnail-training__inner">
          <div className="thumbnail-training__image">
            <picture>
              <img
                src={imageUrl}
                width={330}
                height={190}
                alt="training-card"
              />
            </picture>
          </div>
          <p className="thumbnail-training__price">{!training.price ? 'Бесплатно': training.price}</p>
          <h3 className="thumbnail-training__title">{training.title}</h3>
          <div className="thumbnail-training__info">
            <ul className="thumbnail-training__hashtags-list">
              <li className="thumbnail-training__hashtags-item">
                <div className="hashtag thumbnail-training__hashtag">
                  <span>#{training.type}</span>
                </div>
              </li>
              <li className="thumbnail-training__hashtags-item">
                <div className="hashtag thumbnail-training__hashtag">
                  <span>#{training.calories}ккал</span>
                </div>
              </li>
            </ul>
            <div className="thumbnail-training__rate">
              <svg width={16} height={16} aria-hidden="true">
                <use xlinkHref="#icon-star" />
              </svg>
              <span className="thumbnail-training__rate-value">
                {training.rating}
              </span>
            </div>
          </div>
          <div className="thumbnail-training__text-wrapper">
            <p className="thumbnail-training__text">
              {training.description}
            </p>
          </div>
          <div className="thumbnail-training__button-wrapper">
            <Link
              className="btn btn--small thumbnail-training__button-catalog"
              to={`/${FrontendRoute.Trainings}/${training.id}`}
            >
              Подробнее
            </Link>
            <Link
              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
              to={`/${FrontendRoute.Trainings}/${training.id}/reviews`}
            >
              Отзывы
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
});
