import 'reactjs-popup/dist/index.css';
import './popup-certificates.css';

import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Slider from 'react-slick';
import Popup from 'reactjs-popup';
import { PopupActions } from 'reactjs-popup/dist/types';

import { SliderBlockItems } from '@2299899-fit-friends/consts';
import { selectUser, useAppSelector } from '@2299899-fit-friends/frontend-core';

import CardCertificate from '../../cards/card-certificate/card-certificate';

type PopupCertificatesProps = {
  trigger: JSX.Element,
};

export default function PopupCertificates({ trigger }: PopupCertificatesProps): JSX.Element {
  const popupRef = useRef<PopupActions | null>(null);
  const slickSliderRef = useRef<Slider | null>(null);
  const [currentItem, setCurrentItem] = useState<number>(0);
  const user = useAppSelector(selectUser);

  const handleCloseButtonClick = () => {
    if (popupRef.current) {
      popupRef.current.close();
    }
  };

  const handleLeftButtonClick = () => {
    if (currentItem > 0) {
      setCurrentItem((old) => old - 1);
      slickSliderRef.current?.slickPrev();
    }
  };

  const handleRightButtonClick = () => {
    if (user?.certificates && currentItem < user?.certificates?.length - SliderBlockItems.DefaultPerPage) {
      setCurrentItem((old) => old + 1);
      slickSliderRef.current?.slickNext();
    }
  };

  const certificateCards = user?.certificates?.map((path, index) =>
    <CardCertificate item={user} path={path} key={`certificate_card_${index}`} />
  );

  return (
    <Popup
      ref={popupRef}
      modal
      trigger={trigger}
      lockScroll={true}
    >
      <Helmet><title>Попап сертификатов — FitFriends</title></Helmet>
      <div className="popup__wrapper">
        <div className="popup-head">
          <h2 className="popup-head__header">Сертификаты</h2>
          <button
            className="btn-icon btn-icon--outlined btn-icon--big"
            type="button"
            aria-label="close"
            onClick={handleCloseButtonClick}
          >
            <svg width={20} height={20} aria-hidden="true">
              <use xlinkHref="#icon-cross" />
            </svg>
          </button>
        </div>
        <div className="popup__content popup__content--purchases">
          <div className="personal-account-coach__controls">
            <button
              className="btn-icon personal-account-coach__control"
              type="button"
              aria-label="previous"
              onClick={handleLeftButtonClick}
              disabled={
                !(
                !!user &&
                !!user?.certificates &&
                !!user?.certificates?.length &&
                currentItem !== 0
                )
              }
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
              disabled={
                !(
                !!user &&
                !!user?.certificates &&
                !!user?.certificates?.length &&
                currentItem < user?.certificates?.length - SliderBlockItems.DefaultPerPage
                )
              }
            >
              <svg width={16} height={14} aria-hidden="true">
                <use xlinkHref="#arrow-right" />
              </svg>
            </button>
          </div>
          <Slider
            ref={slickSliderRef}
            className="personal-account-coach__list"
            slidesToShow={SliderBlockItems.DefaultPerPage}
            slidesToScroll={SliderBlockItems.DefaultToScroll}
            infinite={false}
            draggable={false}
          >
            {certificateCards}
          </Slider>
        </div>
      </div>
    </Popup>
  );
}
