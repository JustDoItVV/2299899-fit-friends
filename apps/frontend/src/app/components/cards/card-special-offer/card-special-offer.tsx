import { memo } from 'react';
import { Link } from 'react-router-dom';

import { DISCOUNT } from '@2299899-fit-friends/consts';
import {
    CatalogItem, fetchTrainingBackgroundPicture, useFetchFileUrl
} from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, Training } from '@2299899-fit-friends/types';

type CardSpecialOfferProps = {
  item: CatalogItem;
};

export default memo(function CardSpecialOffer({ item }: CardSpecialOfferProps): JSX.Element {
  const training = item as Training;
  const thumbnailUrl = useFetchFileUrl(fetchTrainingBackgroundPicture, { id: training.id }, 'img/content/placeholder.png');

  return (
    <Link className="promo-slider" to={`/${FrontendRoute.Trainings}/${training.id}`}>
      <div className="promo-slider__overlay" />
      <div className="promo-slider__image">
        <img
          src={thumbnailUrl}
          width={1040}
          height={469}
          alt="promo"
        />
      </div>
      <div className="promo-slider__header">
        <h3 className="promo-slider__title">{training.title}</h3>
        <div className="promo-slider__logo">
          <svg width={74} height={74} aria-hidden="true">
            <use xlinkHref="#logotype" />
          </svg>
        </div>
      </div>
      <span className="promo-slider__text">
        Горячее предложение
      </span>
      <div className="promo-slider__bottom-container">
        <div className="promo-slider__slider-dots">
        </div>
        <div className="promo-slider__price-container">
          <p className="promo-slider__price">{Math.round(training.price * (1 - DISCOUNT))} ₽</p>
          <p className="promo-slider__sup">за занятие</p>
          <p className="promo-slider__old-price">{training.price} ₽</p>
        </div>
      </div>
    </Link>
  );
});
