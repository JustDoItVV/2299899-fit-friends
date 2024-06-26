import { memo } from 'react';
import { Link } from 'react-router-dom';

import { PlaceholderPath } from '@2299899-fit-friends/consts';
import {
    CatalogItem, fetchTrainingBackgroundPicture, useFetchFileUrl
} from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, Order } from '@2299899-fit-friends/types';

import Loading from '../../loading/loading';

type OrderCatalogCardProps = {
  item: CatalogItem;
};

export default memo(function OrderCatalogCard({ item }: OrderCatalogCardProps): JSX.Element {
  const order = item as Order;
  const { fileUrl: thumbnailUrl, loading } = useFetchFileUrl(
    fetchTrainingBackgroundPicture,
    { id: order.trainingId },
    PlaceholderPath.Image,
    [order],
  );
  const rating = order.training?.rating;

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
                alt="training"
                data-testid='card-image'
              />
            }
          </picture>
        </div>
        <p className="thumbnail-training__price">
          <span className="thumbnail-training__price-value">{order.training?.price}</span>
          <span>₽</span>
        </p>
        <h2 className="thumbnail-training__title">{order.training?.title}</h2>
        <div className="thumbnail-training__info">
          <ul className="thumbnail-training__hashtags-list">
            <li className="thumbnail-training__hashtags-item">
              <div className="hashtag thumbnail-training__hashtag">
                <span>#{order.training?.type}</span>
              </div>
            </li>
            <li className="thumbnail-training__hashtags-item">
              <div className="hashtag thumbnail-training__hashtag">
                <span>#{order.training?.calories}ккал</span>
              </div>
            </li>
          </ul>
          <div className="thumbnail-training__rate">
            <svg width={16} height={16} aria-hidden="true">
              <use xlinkHref="#icon-star" />
            </svg>
            <span className="thumbnail-training__rate-value">
              {
                rating &&
                (rating - Math.floor(rating)) > 0
                ? rating.toFixed(1)
                : rating
              }
            </span>
          </div>
        </div>
        <div className="thumbnail-training__text-wrapper">
          <p className="thumbnail-training__text">
            {order.training?.description}
          </p>
        </div>
        <Link
          className="btn-flat btn-flat--underlined thumbnail-training__button-orders"
          to={`/${FrontendRoute.Trainings}/${order.trainingId}`}
        >
          <svg width={18} height={18} aria-hidden="true">
            <use xlinkHref="#icon-info" />
          </svg>
          <span>Подробнее</span>
        </Link>
      </div>
      <div className="thumbnail-training__total-info">
        <div className="thumbnail-training__total-info-card">
          <svg width={32} height={32} aria-hidden="true">
            <use xlinkHref="#icon-chart" />
          </svg>
          <p className="thumbnail-training__total-info-value">{order.amount}</p>
          <p className="thumbnail-training__total-info-text">
            Куплено тренировок
          </p>
        </div>
        <div className="thumbnail-training__total-info-card">
          <svg width={31} height={28} aria-hidden="true">
            <use xlinkHref="#icon-wallet" />
          </svg>
          <p className="thumbnail-training__total-info-value">
            {order.orderSum}<span>₽</span>
          </p>
          <p className="thumbnail-training__total-info-text">
            Общая сумма
          </p>
        </div>
      </div>
    </div>
  );
});
