import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './account-certificates.css';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

import { SliderBlockItems } from '@2299899-fit-friends/consts';
import {
    checkAuth, selectCurrentUser, updateUser, useAppDispatch, useAppSelector
} from '@2299899-fit-friends/frontend-core';

import CardCertificate from '../cards/card-certificate/card-certificate';

export default function AccountCertificates(): JSX.Element {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const [items, setItems] = useState<JSX.Element[]>([]);
  const [currentItem, setCurrentItem] = useState<number>(0);

  const slickSliderRef = useRef<Slider | null>(null);
  const certificateInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const certificateCards = currentUser?.certificates?.map((path, index) =>
      <CardCertificate
        item={currentUser}
        path={path}
        key={`certificate_card_${index}`}
        changeable={true}
      />
    );
    if (certificateCards) {
      setItems(certificateCards);
    }
  }, [currentUser]);

  const handleLeftButtonClick = () => {
    slickSliderRef.current?.slickPrev();
    if (currentItem > 0) {
      setCurrentItem(currentItem - 1);
    }
  };

  const handleRightButtonClick = () => {
    if (currentItem < items.length - 1) {
      setCurrentItem(currentItem + 1);
      slickSliderRef.current?.slickNext();
    }
  };

  const handleUploadCertificateButtonClick = () => {
    certificateInputRef.current?.click();
  };

  const handleUploadCertificateInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.currentTarget.files;
    if (currentUser?.id && files && files.length !== 0) {
      const formData = new FormData();

      formData.append('certificate', files[0]);

      dispatch(updateUser({ id: currentUser.id, data: formData }));
      dispatch(checkAuth());
    }
  };

  return (
    <div className="personal-account-coach__additional-info">
      <div className="personal-account-coach__label-wrapper">
        <h2 className="personal-account-coach__label">
          Дипломы и сертификаты
        </h2>
        <button
          className="btn-flat btn-flat--underlined personal-account-coach__button"
          type="button"
          onClick={handleUploadCertificateButtonClick}
        >
          <input
            className='visually-hidden'
            ref={certificateInputRef}
            type="file"
            name="certificate"
            tabIndex={-1}
            accept=".pdf"
            onChange={handleUploadCertificateInputChange}
            data-testid='account-certificate-input-upload'
          />
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
            disabled={items.length === 0 || currentItem === 0}
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
            disabled={items.length === 0 || currentItem >= items.length - SliderBlockItems.AccountTrainerCertificatesVisible}
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
        slidesToShow={SliderBlockItems.AccountTrainerCertificatesVisible}
        slidesToScroll={SliderBlockItems.DefaultToScroll}
        infinite={false}
        draggable={false}
        arrows={false}
        dots={false}
        variableWidth={true}
        adaptiveHeight={true}
      >
        {items}
      </Slider>
    </div>
  );
}
