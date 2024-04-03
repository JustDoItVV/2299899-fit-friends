import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import { METRO_STATIONS } from '@2299899-fit-friends/consts';
import { selectResponseError, selectUser, updateUserAction } from '@2299899-fit-friends/storage';
import { TrainingLevel, TrainingType, UserGender, UserRole } from '@2299899-fit-friends/types';

import { useAppDispatch, useAppSelector } from '../hooks';

export default function PersonalAbout(): JSX.Element {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const responseError = useAppSelector(selectResponseError);

  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(true);

  const nameRef = useRef<string>(user ? user.name : '');
  const descriptionRef = useRef<string>(user?.description || '');
  const statusRef = useRef<boolean>(user && user.role === UserRole.Trainer ? !!user.isReadyToPersonal : !!user?.isReadyToTraining);
  const statusElementRef = useRef<HTMLInputElement | null>(null);
  const trainigTypesRef = useRef<TrainingType[]>(user ? user.trainingType : []);
  const locationRef = useRef<string>(user ? user.location : METRO_STATIONS[0]);
  const genderRef = useRef<UserGender>(user ? user.gender : UserGender.Other);
  const levelRef = useRef<TrainingLevel>(user ? user.trainingLevel : TrainingLevel.Beginner);

  useEffect(() => {
    if (user) {
      nameRef.current = user.name;
      descriptionRef.current = user.description || '';
      statusRef.current = user.role === UserRole.Trainer ? !!user.isReadyToPersonal : !!user.isReadyToTraining;
      if (statusElementRef.current) {
        statusElementRef.current.checked = statusRef.current;
      }
      trainigTypesRef.current = user.trainingType;
      locationRef.current = user.location;
      genderRef.current = user.gender;
      levelRef.current = user.trainingLevel;
    }
  }, [user]);

  useEffect(() => {
    if (responseError) {
      setIsFormDisabled(false);
    }
  }, [responseError]);

  const handleEditButtonClick = () => {
    setIsFormDisabled(!isFormDisabled);
  }

  const getInputChangeHandler = <T, V extends HTMLInputElement | HTMLSelectElement>(ref: React.MutableRefObject<T>) =>
  (evt: ChangeEvent<V>) => {
    if (evt.currentTarget) {
      ref.current = evt.currentTarget.value as T;
    }
  };

  const getCheckboxChangeHadnler = (ref: React.MutableRefObject<boolean>) =>
  (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget) {
      ref.current = evt.currentTarget.checked;
      evt.currentTarget.defaultChecked = ref.current;
    }
  };

  const hadleTrainingTypeInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const trainingType = evt.currentTarget.value as TrainingType;

    if (!trainigTypesRef.current.includes(trainingType)) {
      trainigTypesRef.current = [...trainigTypesRef.current, trainingType];
    } else {
      const elementIndex = trainigTypesRef.current.indexOf(trainingType)
      trainigTypesRef.current = [
        ...trainigTypesRef.current.slice(0, elementIndex),
        ...trainigTypesRef.current.slice(elementIndex + 1),
      ];
    }
  };

  const handleFormSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    const formData = new FormData();

    formData.append('name', nameRef.current);
    formData.append('description', descriptionRef.current);
    formData.append(`${user?.role === UserRole.Trainer ? 'isReadyToPersonal' : 'isReadyToTraining'}`, statusRef.current.toString());
    console.log(formData.get('isReadyToPersonal'));

    trainigTypesRef.current.forEach((type) => {
      formData.append('trainingType', type);
    });

    formData.append('location', locationRef.current);
    formData.append('gender', genderRef.current);
    formData.append('trainingLevel', levelRef.current);

    dispatch(updateUserAction({ id: user?.id || '', data: formData }))
  }

  const trainingTypesElements = Object.values(TrainingType).map((type, index) => (
    <div className="btn-checkbox" key={`training_type_${index}`}>
      <label>
        <input
          className="visually-hidden"
          type="checkbox"
          name="trainingType"
          value={type}
          defaultChecked={trainigTypesRef.current.includes(type)}
          onChange={hadleTrainingTypeInputChange}
          disabled={isFormDisabled}
        />
        <span className="btn-checkbox__btn">{type}</span>
      </label>
    </div>
  ));

  const locationOptionElements = METRO_STATIONS.map((location, index) => (
    <option key={`location_${index}`}>{location}</option>
  ));

  const genderOptionElements = Object.values(UserGender).map((gender, index) => (
    <option key={`gender_${index}`}>{gender}</option>
  ));

  const levelOptionElements = Object.values(TrainingLevel).map((level, index) => (
    <option key={`level_${index}`}>{level}</option>
  ));

  const getResponseErrorMessage = (
    codes: number[],
    statusCode: number | undefined,
    message: string | string[] | undefined,
    field: string
  ) => {
    if (!statusCode || !message || !codes.includes(statusCode)) {
      return ' ';
    }

    if (!Array.isArray(message)) {
      return message;
    }

    return message.filter((item) => item.toLowerCase().includes(field)).join(', ');
  };

  return (
    <section className="user-info-edit">
      <div className="user-info-edit__header">
        <div className="input-load-avatar">
          <label>
            <input
              className="visually-hidden"
              type="file"
              name="user-photo-1"
              accept="image/png, image/jpeg"
            />
            <span className="input-load-avatar__avatar">
              <img
                src={user?.id && `http://localhost:3001/api/user/${user.id}/avatar`}
                width={98}
                height={98}
                alt="user avatar"
              />
            </span>
          </label>
        </div>
        {!isFormDisabled &&
          <div className="user-info-edit__controls">
            <button className="user-info-edit__control-btn" aria-label="обновить">
              <svg width={16} height={16} aria-hidden="true">
                <use xlinkHref="#icon-change" />
              </svg>
            </button>
            <button className="user-info-edit__control-btn" aria-label="удалить">
              <svg width={14} height={16} aria-hidden="true">
                <use xlinkHref="#icon-trash" />
              </svg>
            </button>
          </div>
        }
      </div>
      <form
        className="user-info-edit__form"
        action="#"
        method="post"
        onSubmit={handleFormSubmit}
      >
        <button
          className="btn-flat btn-flat--underlined user-info-edit__save-button"
          type={isFormDisabled ? 'submit' : 'button'}
          aria-label={isFormDisabled ? 'Редактировать' : 'Сохранить'}
          onClick={handleEditButtonClick}
        >
          <svg width={12} height={12} aria-hidden="true">
            <use xlinkHref="#icon-edit" />
          </svg>
          <span>
            {isFormDisabled ? 'Редактировать' : 'Сохранить'}
          </span>
        </button>
        <div className="user-info-edit__section">
          <h2 className="user-info-edit__title">Обо мне</h2>
          <div className={`custom-input ${isFormDisabled ? 'custom-input--readonly user-info__input' : 'user-info-edit__input'}`}>
            <label>
              <span className="custom-input__label">
                Имя
              </span>
              <span className="custom-input__wrapper">
                <input
                  type="text"
                  name="name"
                  value={nameRef.current}
                  onChange={getInputChangeHandler<string, HTMLInputElement>(nameRef)}
                  disabled={isFormDisabled}
                />
              </span>
              <span className="custom-input__error">
                {getResponseErrorMessage(
                  [400],
                  responseError?.statusCode,
                  responseError?.message,
                  'name'
                )}
              </span>
            </label>
          </div>
          <div className={`custom-textarea ${isFormDisabled ? 'custom-textarea--readonly user-info__textarea' : 'user-info-edit__textarea'}`}>
            <label>
              <span className="custom-textarea__label">Описание</span>
              <textarea
                name="description"
                placeholder=" "
                defaultValue={descriptionRef.current}
                disabled={isFormDisabled}
              />
              <span className="custom-input__error">
                {getResponseErrorMessage(
                  [400],
                  responseError?.statusCode,
                  responseError?.message,
                  'description'
                )}
              </span>
            </label>
          </div>
        </div>
        <div className="user-info-edit__section user-info-edit__section--status">
          <h2 className="user-info-edit__title user-info-edit__title--status">
            Статус
          </h2>
          <div className="custom-toggle custom-toggle--switch user-info-edit__toggle">
            <label>
              <input
                ref={statusElementRef}
                type="checkbox"
                name="ready-for-training"
                defaultChecked={statusRef.current}
                disabled={isFormDisabled}
                onChange={getCheckboxChangeHadnler(statusRef)}
              />
              <span className="custom-toggle__icon">
                <svg width={9} height={6} aria-hidden="true">
                  <use xlinkHref="#arrow-check" />
                </svg>
              </span>
              <span className="custom-toggle__label">
                {user?.role && user.role === UserRole.Trainer ? 'Готов тренировать' : 'Готов к тренировке'}
              </span>
            </label>
          </div>
        </div>
        <div className="user-info-edit__section">
          <h2 className="user-info-edit__title user-info-edit__title--specialization">
            Специализация
          </h2>
          <div className="specialization-checkbox user-info-edit__specialization">
            {trainingTypesElements}
          </div>
          <span className="custom-input__error">
            {getResponseErrorMessage(
              [400],
              responseError?.statusCode,
              responseError?.message,
              'type'
            )}
          </span>
        </div>
        <div className={isFormDisabled ? 'custom-edit--readonly user-info__edit' : 'user-info-edit__select'}>
          <span className="custom-select__label">Локация</span>
          <select
            className="custom-select__button"
            id="location_select"
            disabled={isFormDisabled}
          >
            {locationOptionElements}
          </select>
          <span className="custom-input__error">
            {getResponseErrorMessage(
              [400],
              responseError?.statusCode,
              responseError?.message,
              'location'
            )}
          </span>
        </div>
        <div className={isFormDisabled ? 'custom-edit--readonly user-info__edit' : 'user-info-edit__select'}>
          <span className="custom-select__label">Пол</span>
          <select
            className="custom-select__button"
            id="gender_select"
            disabled={isFormDisabled}
          >
            {genderOptionElements}
          </select>
          <span className="custom-input__error">
            {getResponseErrorMessage(
              [400],
              responseError?.statusCode,
              responseError?.message,
              'gender'
            )}
          </span>
        </div>
        <div className={isFormDisabled ? 'custom-edit--readonly user-info__edit' : 'user-info-edit__select'}>
          <span className="custom-select__label">Уровень</span>
          <select
            className="custom-select__button"
            id="gender_select"
            disabled={isFormDisabled}
          >
            {levelOptionElements}
          </select>
          <span className="custom-input__error">
            {getResponseErrorMessage(
              [400],
              responseError?.statusCode,
              responseError?.message,
              'level'
            )}
          </span>
        </div>
      </form>
    </section>
  );
}
