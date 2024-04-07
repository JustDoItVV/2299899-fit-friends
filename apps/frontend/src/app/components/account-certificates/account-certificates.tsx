import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useRef } from 'react';
import Slider from 'react-slick';

import { selectUser, useAppSelector } from '@2299899-fit-friends/frontend-core';

import CardCertificate from '../cards/card-certificate/card-certificate';

export default function AccountCertificates(): JSX.Element {
  const slickSliderRef = useRef<Slider | null>(null);
  const currentUser = useAppSelector(selectUser);

  const handleLeftButtonClick = () => {
    slickSliderRef.current?.slickPrev();
  };

  const handleRightButtonClick = () => {
    slickSliderRef.current?.slickNext();
  };

  const certificateCards = currentUser?.certificates?.map((path, index) =>
    <CardCertificate item={currentUser} key={`certificate_card_${index}`} />
  );

  return (
    <div className="personal-account-coach__additional-info">
      <div className="personal-account-coach__label-wrapper">
        <h2 className="personal-account-coach__label">
          Дипломы и сертификаты
        </h2>
        <button
          className="btn-flat btn-flat--underlined personal-account-coach__button"
          type="button"
        >
          <svg width={14} height={14} aria-hidden="true">
            <use xlinkHref="#icon-import" />
          </svg>
          <span>Загрузить</span>
        </button>
        <div className="personal-account-coach__controls">
          <button
            className="btn-icon personal-account-coach__control"
            type="button"
            aria-label="previous"
            onClick={handleLeftButtonClick}
          >
            <svg width={16} height={14} aria-hidden="true">
              <use xlinkHref="#arrow-left" />
            </svg>
          </button>
          <button
            className="btn-icon personal-account-coach__control"
            type="button"
            aria-label="next"
            onClick={handleRightButtonClick}
          >
            <svg width={16} height={14} aria-hidden="true">
              <use xlinkHref="#arrow-right" />
            </svg>
          </button>
        </div>
      </div>
        <Slider
          ref={slickSliderRef}
          className="personal-account-coach__list"
          infinite
          slidesToShow={3}
          slidesToScroll={3}
        >
          {certificateCards}
        </Slider>
    </div>
  );
}
