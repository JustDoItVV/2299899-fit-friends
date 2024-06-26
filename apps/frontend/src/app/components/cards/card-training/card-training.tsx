import { memo } from 'react';
import { Link } from 'react-router-dom';

import { PlaceholderPath } from '@2299899-fit-friends/consts';
import {
    CatalogItem, fetchTrainingBackgroundPicture, useFetchFileUrl
} from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, Training } from '@2299899-fit-friends/types';

import Loading from '../../loading/loading';

type CardTrainingProps = {
  item: CatalogItem;
};

export default memo(function CardTraining({ item }: CardTrainingProps): JSX.Element {
  const training = item as Training;
  const { fileUrl: thumbnailUrl, loading } = useFetchFileUrl(
    fetchTrainingBackgroundPicture,
    { id: training.id },
    PlaceholderPath.Image,
    [training],
  );

  return (
    <div className="thumbnail-training">
      <div className="thumbnail-training__inner">
        <div className="thumbnail-training__image">
          <picture>
            {
              loading
              ?
              <Loading />
              :
              <img
                src={thumbnailUrl}
                width={330}
                height={190}
                alt={training.title}
                data-testid='card-image'
              />
            }
          </picture>
        </div>
        <p className="thumbnail-training__price">{!training.price ? 'Бесплатно': `${training.price} ₽`}</p>
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
              {
                (training.rating - Math.floor(training.rating)) > 0
                ? training.rating.toFixed(1)
                : training.rating
              }
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
  );
});
