import './popup-buy.css';

import { ChangeEvent, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Popup from 'reactjs-popup';
import { PopupActions } from 'reactjs-popup/dist/types';

import {
    fetchTrainingBackgroundPicture, updateBalance, useAppDispatch, useFetchFileUrl
} from '@2299899-fit-friends/frontend-core';
import { OrderPaymentMethod } from '@2299899-fit-friends/types';

import Loading from '../../loading/loading';

type PopupBuyProps = {
  trainingId: string | undefined;
  trainingTitle: string | undefined;
  trainingPrice: number | undefined;
  trigger: JSX.Element,
};

export default function PopupBuy(props: PopupBuyProps): JSX.Element {
  const { trainingId, trainingTitle, trainingPrice, trigger } = props;
  const dispatch = useAppDispatch();
  const { fileUrl: thumbnailUrl, loading } = useFetchFileUrl(fetchTrainingBackgroundPicture, { id: trainingId }, 'img/content/placeholder.png');

  const [amount, setAmount] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const popupRef = useRef<PopupActions | null>(null);
  const amountInputRef = useRef<HTMLInputElement | null>(null);

  const handleCloseButtonClick = () => {
    if (popupRef.current) {
      popupRef.current.close();
    }
  };

  const handleMinusAmountButtonClick = () => {
    if (amount > 0) {
      setAmount((old) => {
        const value = old - 1;
        if (amountInputRef.current) {
          amountInputRef.current.value = value.toString();
        }
        return value;
      });
    }
  };

  const handlePlusAmountButtonClick = () => {
    setAmount((old) => {
      const value = old + 1;
      if (amountInputRef.current) {
        amountInputRef.current.value = value.toString();
      }
      return value;
    });
  };

  const handleAmountInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.valueAsNumber;
    if (value) {
      setAmount(value);
    }
  };

  const handlePaymentMethodInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.value;
    if (value) {
      setPaymentMethod(value);
    }
  };

  const handleClosePopup = () => {
    setAmount(1);
    setPaymentMethod(null);
  };

  const handleBuyButtonClick = () => {
    if (trainingId && amount && paymentMethod) {
      dispatch(updateBalance({ trainingId, available: amount, paymentMethod }));
      popupRef.current?.close();
    }
  };

  return (
    <Popup
      ref={popupRef}
      modal
      trigger={trigger}
      lockScroll={true}
      onClose={handleClosePopup}
      className='popup-buy'
    >
      <Helmet><title>Попап покупки — FitFriends</title></Helmet>
      <div className="">
        <div className="popup-head">
          <h2 className="popup-head__header">Купить тренировку</h2>
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
          <div className="popup__product">
            <div className="popup__product-image">
              <picture>
                {
                  loading
                  ?
                  <Loading />
                  :
                  <img src={thumbnailUrl} alt="" />
                }
              </picture>
            </div>
            <div className="popup__product-info">
              <h3 className="popup__product-title">{trainingTitle}</h3>
              <p className="popup__product-price">{trainingPrice} ₽</p>
            </div>
            <div className="popup__product-quantity">
              <p className="popup__quantity">Количество</p>
              <div className="input-quantity">
                <button
                  className="btn-icon btn-icon--quantity"
                  type="button"
                  aria-label="minus"
                  onClick={handleMinusAmountButtonClick}
                >
                  <svg width={12} height={12} aria-hidden="true">
                    <use xlinkHref="#icon-minus" />
                  </svg>
                </button>
                <div className="input-quantity__input">
                  <label>
                    <input
                      ref={amountInputRef}
                      type="text"
                      defaultValue={1}
                      size={2}
                      onChange={handleAmountInputChange}
                    />
                  </label>
                </div>
                <button
                  className="btn-icon btn-icon--quantity"
                  type="button"
                  aria-label="plus"
                  onClick={handlePlusAmountButtonClick}
                >
                  <svg width={12} height={12} aria-hidden="true">
                    <use xlinkHref="#icon-plus" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <section className="payment-method">
            <h4 className="payment-method__title">Выберите способ оплаты</h4>
            <ul className="payment-method__list">
              <li className="payment-method__item">
                <div className="btn-radio-image">
                  <label>
                    <input
                      type="radio"
                      name="payment-purchases"
                      aria-label="Visa."
                      value={OrderPaymentMethod.Visa}
                      onChange={handlePaymentMethodInputChange}
                    />
                    <span className="btn-radio-image__image">
                      <svg width={58} height={20} aria-hidden="true">
                        <use xlinkHref="#visa-logo" />
                      </svg>
                    </span>
                  </label>
                </div>
              </li>
              <li className="payment-method__item">
                <div className="btn-radio-image">
                  <label>
                    <input
                      type="radio"
                      name="payment-purchases"
                      aria-label="Мир."
                      value={OrderPaymentMethod.Mir}
                      onChange={handlePaymentMethodInputChange}
                    />
                    <span className="btn-radio-image__image">
                      <svg width={66} height={20} aria-hidden="true">
                        <use xlinkHref="#mir-logo" />
                      </svg>
                    </span>
                  </label>
                </div>
              </li>
              <li className="payment-method__item">
                <div className="btn-radio-image">
                  <label>
                    <input
                      type="radio"
                      name="payment-purchases"
                      aria-label="Iomoney."
                      value={OrderPaymentMethod.Umoney}
                      onChange={handlePaymentMethodInputChange}
                    />
                    <span className="btn-radio-image__image">
                      <svg width={106} height={24} aria-hidden="true">
                        <use xlinkHref="#iomoney-logo" />
                      </svg>
                    </span>
                  </label>
                </div>
              </li>
            </ul>
          </section>
          <div className="popup__total">
            <p className="popup__total-text">Итого</p>
            <svg
              className="popup__total-dash"
              width={310}
              height={2}
              aria-hidden="true"
            >
              <use xlinkHref="#dash-line" />
            </svg>
            <p className="popup__total-price">{trainingPrice ? amount * trainingPrice : ''}&nbsp;₽</p>
          </div>
          <div className="popup__button">
            <button
              className="btn"
              type="button"
              onClick={handleBuyButtonClick}
              disabled={!amount || !paymentMethod}
            >
              Купить
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
