import './popup-review.css';
import 'reactjs-popup/dist/index.css';

import { ChangeEvent, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Popup from 'reactjs-popup';
import { PopupActions } from 'reactjs-popup/dist/types';

import {
    createReview, selectResponseError, useAppDispatch, useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { getResponseErrorMessage, pass } from '@2299899-fit-friends/helpers';
import { unwrapResult } from '@reduxjs/toolkit';

type PopupReviewProps = {
  trainingId: string | undefined;
  trigger: JSX.Element,
};

export default function PopupReview({ trainingId, trigger }: PopupReviewProps): JSX.Element {
  const dispatch = useAppDispatch();
  const responseError = useAppSelector(selectResponseError);
  const popupRef = useRef<PopupActions | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [text, setText] = useState<string | null>(null);

  const handleRatingInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setRating(parseInt(evt.currentTarget.value, 10));
  };

  const handleTextareaChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setText(evt.currentTarget.value);
  };

  const handleCloseButtonClick = () => {
    if (popupRef.current) {
      popupRef.current.close();
    }
  }

  const handleCreateReviewButtonClick = async () => {
    if (trainingId && rating && text) {
      try {
        unwrapResult(await dispatch(createReview({ id: trainingId, data: { rating, text } })));
        popupRef.current?.close();
      } catch {
        pass();
      }
    }
  };

  const ratingElements = [...Array(5).keys()].map((index) => (
    <li className="popup__rate-item" key={`new_review_rating_${index + 1}`}>
      <div className="popup__rate-item-wrap">
        <label>
          <input
            type="radio"
            name="оценка тренировки"
            aria-label={`оценка ${index + 1}.`}
            value={index + 1}
            onChange={handleRatingInputChange}
          />
          <span className="popup__rate-number">{index + 1}</span>
        </label>
      </div>
    </li>
  ));

  return (
    <Popup
      ref={popupRef}
      modal
      trigger={trigger}
      lockScroll={true}
      className='popup-review'
    >
        <Helmet><title>Попап оставить отзыв — FitFriends</title></Helmet>
        <div className="">
          <div className="popup-head">
            <h2 className="popup-head__header">Оставить отзыв</h2>
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
          <div className="popup__content popup__content--feedback">
            <h3 className="popup__feedback-title">Оцените тренировку</h3>
            <ul className="popup__rate-list">
              {ratingElements}
            </ul>
            <span className="custom-input__error">
              {getResponseErrorMessage(responseError, 'rating')}
            </span>
            <div className="popup__feedback">
              <h3 className="popup__feedback-title popup__feedback-title--text">
                Поделитесь своими впечатлениями о тренировке
              </h3>
              <div className="popup__feedback-textarea">
                <div className="custom-textarea">
                  <label>
                    <textarea
                      name="description"
                      placeholder=''
                      defaultValue=''
                      onChange={handleTextareaChange}
                    />
                     <span className="custom-input__error">
                      {getResponseErrorMessage(responseError, 'text')}
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="popup__button">
              <button
                className="btn"
                type="button"
                disabled={!(!!rating && !!text)}
                onClick={handleCreateReviewButtonClick}
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
    </Popup>
  );
}
