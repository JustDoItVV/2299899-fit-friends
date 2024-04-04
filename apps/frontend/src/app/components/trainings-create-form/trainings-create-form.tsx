import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';

import { TrainingVideoAllowedExtensions } from '@2299899-fit-friends/consts';
import {
    createTrainingAction, selectResponseError, useAppDispatch, useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { getResponseErrorMessage } from '@2299899-fit-friends/helpers';
import {
    TrainingAuditory, TrainingDuration, TrainingLevel, TrainingType
} from '@2299899-fit-friends/types';

import ErrorPopup from '../error-popup/error-popup';

export default function TrainingsCreateForm(): JSX.Element {
  const dispatch = useAppDispatch();
  const responseError = useAppSelector(selectResponseError);

  const titleRef = useRef<string>('');
  const trainingTypeRef = useRef<TrainingType | ''>('');
  const caloriesRef = useRef<string>('');
  const durationRef = useRef<TrainingDuration | ''>('');
  const priceRef = useRef<string>('');
  const levelRef = useRef<TrainingLevel | ''>('');
  const genderRef = useRef<TrainingAuditory>(TrainingAuditory.All);
  const descriptionRef = useRef<string>('');
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [filename, setFilename] = useState<string>(`Загрузите сюда файлы формата ${
    Object.keys(TrainingVideoAllowedExtensions).map(((extention) => extention.toLocaleUpperCase())).join(', ')
  }`)

  if (responseError && responseError.statusCode === 500) {
    return <ErrorPopup statusCode={500} />;
  }

  const handleFormSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    const formData = new FormData();

    formData.append('title', titleRef.current);
    formData.append('type', trainingTypeRef.current);
    formData.append('calories', caloriesRef.current);
    formData.append('duration', durationRef.current);
    formData.append('price', priceRef.current);
    formData.append('level', levelRef.current);
    formData.append('gender', genderRef.current);
    formData.append('description', descriptionRef.current);
    formData.append('isSpecialOffer', '');

    if (videoInputRef.current?.files && videoInputRef.current.files.length > 0) {
      formData.append('video', videoInputRef.current.files[0]);
    }

    dispatch(createTrainingAction(formData));
  };

  const getInputSelectTextareaChangeHandler = <T,>(ref: React.MutableRefObject<T>) =>
    (evt: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      ref.current = evt.currentTarget.value as T;
    };

  const handleVideoInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget?.files && evt.currentTarget.files.length > 0) {
      setFilename(evt.currentTarget.files[0].name);
    }
  };

  const trainingTypeOptionElements = Object.values(TrainingType).map((type, index) => (
    <option key={`training_type_${index}`} value={type}>{type}</option>
  ));

  const durationOptionElements = Object.values(TrainingDuration).map((duration, index) => (
    <option key={`training_duration_${index}`} value={duration}>{duration}</option>
  ));

  const levelOptionElements = Object.values(TrainingLevel).map((level, index) => (
    <option key={`level_${index}`}>{level}</option>
  ));

  const genderRadioElements = Object.values(TrainingAuditory).map((gender, index) => (
    <div className="custom-toggle-radio__block" key={`gender_${index}`}>
      <label>
        <input
          type="radio"
          name="gender"
          value={gender}
          defaultChecked={gender === TrainingAuditory.All}
          onChange={getInputSelectTextareaChangeHandler<TrainingAuditory>(genderRef)}
        />
        <span className="custom-toggle-radio__icon" />
        <span className="custom-toggle-radio__label">
          {gender.charAt(0).toLocaleUpperCase() + gender.slice(1)}
        </span>
      </label>
    </div>
  ));

  return (
    <div className="popup-form popup-form--create-training">
      <div className="popup-form__wrapper">
        <div className="popup-form__content">
          <div className="popup-form__title-wrapper">
            <h1 className="popup-form__title">Создание тренировки</h1>
          </div>
          <div className="popup-form__form">
            <form method="post" onSubmit={handleFormSubmit}>
              <div className="create-training">
                <div className="create-training__wrapper">
                  <div className="create-training__block">
                    <h2 className="create-training__legend">
                      Название тренировки
                    </h2>
                    <div className="custom-input create-training__input">
                      <label>
                        <span className="custom-input__wrapper">
                          <input type="text" name="training-name" onChange={getInputSelectTextareaChangeHandler<string>(titleRef)} />
                        </span>
                        <span className="custom-input__error">
                          {getResponseErrorMessage(responseError, 'title')}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="create-training__block">
                    <h2 className="create-training__legend">
                      Характеристики тренировки
                    </h2>
                    <div className="create-training__info">
                      <div className="custom-input custom-input__wrapper">
                        <label className="custom-select__label">
                          Выберите тип тренировки
                        </label>
                        <select
                          className="custom-select__button"
                          defaultValue=""
                          onChange={getInputSelectTextareaChangeHandler<TrainingType | ''>(trainingTypeRef)}
                        >
                          <option disabled style={{ display: "none"}}></option>
                          {trainingTypeOptionElements}
                        </select>
                        <span className="custom-input__error">
                          {getResponseErrorMessage(responseError, 'type')}
                        </span>
                      </div>
                      <div className="custom-input custom-input--with-text-right">
                        <label>
                          <span className="custom-input__label">
                            Сколько калорий потратим
                          </span>
                          <span className="custom-input__wrapper">
                            <input type="number" name="calories" onChange={getInputSelectTextareaChangeHandler<string>(caloriesRef)} />
                            <span className="custom-input__text">ккал</span>
                          </span>
                          <span className="custom-input__error">
                            {getResponseErrorMessage(responseError, 'calories')}
                          </span>
                        </label>
                      </div>
                      <div className="custom-input custom-input__wrapper">
                        <label className="custom-select__label">
                          Сколько времени потратим
                        </label>
                        <select
                          className="custom-select__button"
                          defaultValue=""
                          onChange={getInputSelectTextareaChangeHandler<TrainingDuration | ''>(durationRef)}
                        >
                          <option disabled style={{ display: "none"}}></option>
                          {durationOptionElements}
                        </select>
                        <span className="custom-input__error">
                          {getResponseErrorMessage(responseError, 'duration')}
                        </span>
                      </div>
                      <div className="custom-input custom-input--with-text-right">
                        <label>
                          <span className="custom-input__label">
                            Стоимость тренировки
                          </span>
                          <span className="custom-input__wrapper">
                            <input type="number" name="price" onChange={getInputSelectTextareaChangeHandler<string>(priceRef)} />
                            <span className="custom-input__text">₽</span>
                          </span>
                          <span className="custom-input__error">
                            {getResponseErrorMessage(responseError, 'price')}
                          </span>
                        </label>
                      </div>
                      <div className="custom-input custom-input__wrapper">
                        <label className="custom-select__label">
                          Выберите уровень тренировки
                        </label>
                        <select
                          className="custom-select__button"
                          defaultValue=""
                          onChange={getInputSelectTextareaChangeHandler<TrainingLevel | ''>(levelRef)}
                        >
                          <option disabled style={{ display: "none"}}></option>
                          {levelOptionElements}
                        </select>
                        <span className="custom-input__error">
                          {getResponseErrorMessage(responseError, 'level')}
                        </span>
                      </div>
                      <div className="create-training__radio-wrapper">
                        <span className="create-training__label">
                          Кому подойдет тренировка
                        </span>
                        <div className="custom-toggle-radio create-training__radio">
                          {genderRadioElements}
                        </div>
                        <span className="custom-input__error">
                          {getResponseErrorMessage(responseError, 'gender')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="create-training__block">
                    <h2 className="create-training__legend">
                      Описание тренировки
                    </h2>
                    <div className="custom-textarea create-training__textarea">
                      <label>
                        <textarea
                          name="description"
                          placeholder=""
                          defaultValue=""
                          onChange={getInputSelectTextareaChangeHandler<string>(descriptionRef)}
                        />
                        <span className="custom-input__error">
                          {getResponseErrorMessage(responseError, 'description')}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="create-training__block">
                    <h2 className="create-training__legend">
                      Загрузите видео-тренировку
                    </h2>
                    <div className="drag-and-drop create-training__drag-and-drop">
                      <label>
                        <span className="drag-and-drop__label" tabIndex={0}>
                          {filename}
                          <svg width={20} height={20} aria-hidden="true">
                            <use xlinkHref="#icon-import-video" />
                          </svg>
                        </span>
                        <input
                          ref={videoInputRef}
                          type="file"
                          name="import"
                          tabIndex={-1}
                          accept={Object.keys(TrainingVideoAllowedExtensions).map(((extention) => `.${extention}`)).join(', ')}
                          onChange={handleVideoInputChange}
                        />
                        <span className="custom-input__error">
                          {getResponseErrorMessage(responseError, 'video')}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <button className="btn create-training__button" type="submit">
                  Опубликовать
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
