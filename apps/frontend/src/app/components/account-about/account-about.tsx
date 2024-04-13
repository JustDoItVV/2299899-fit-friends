import './account-about.css';

import { ChangeEvent, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';

import { AllowedImageFormat, METRO_STATIONS, PlaceholderPath } from '@2299899-fit-friends/consts';
import {
    dropToken, fetchUserAvatar, selectCurrentUser, selectResponseError, setAuthStatus,
    setCurrentUser, updateUser, useAppDispatch, useAppSelector, useFetchFileUrl
} from '@2299899-fit-friends/frontend-core';
import { getResponseErrorMessage } from '@2299899-fit-friends/helpers';
import {
    AuthStatus, TrainingLevel, TrainingType, UserGender, UserRole
} from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';

import Loading from '../loading/loading';

export default function AccountAbout(): JSX.Element {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const responseError = useAppSelector(selectResponseError);
  const { fileUrl: avatar, setFileUrl: setAvatar, loading } = useFetchFileUrl(
    fetchUserAvatar,
    { id: currentUser?.id },
    PlaceholderPath.Image,
    [currentUser],
  );

  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(true);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [gender, setGender] = useState<UserGender | null>(null);
  const [level, setLevel] = useState<TrainingLevel | null>(null);
  const [deleteAvatar, setDeleteAvatar] = useState<boolean>(false);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const statusElementRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDescription(currentUser.description ?? '');
      setStatus(currentUser.role === UserRole.Trainer ? !!currentUser.isReadyToPersonal : !!currentUser.isReadyToTraining);
      setTrainingTypes(currentUser.trainingType);
      setLocation(currentUser.location);
      setGender(currentUser.gender);
      setLevel(currentUser.trainingLevel);
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (responseError) {
      setIsFormDisabled(false);
    }
  }, [responseError]);

  if (!currentUser) {
    return (
      <section className="user-info-edit">
        <Loading />
      </section>
    );
  }

  const handleEditButtonClick = () => {
    setIsFormDisabled(!isFormDisabled);
  };

  const handleUpdateAvatarButtonClick = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleAvatarInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget.files) {
      const file = evt.currentTarget.files[0];
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const handleDeleteAvatarButtonClick = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.files = null;
    }
    setAvatar(PlaceholderPath.Image);
    setDeleteAvatar(true);
  };

  const getInputChangeHandler = <T, V extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    setState: React.Dispatch<React.SetStateAction<T>>
  ) => (evt: ChangeEvent<V>) => {
    if (evt.currentTarget) {
      setState(evt.currentTarget.value as T);
    }
  };

  const handleStatusCheckboxChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget) {
      setStatus(evt.currentTarget.checked);
    }
  };

  const hadleTrainingTypeInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const trainingType = evt.currentTarget.value as TrainingType;
    setTrainingTypes((old) => {
      let newValues;
      if (!old.includes(trainingType)) {
        newValues = [...old, trainingType];
      } else {
        const elementIndex = old.indexOf(trainingType);
        newValues = [...old.slice(0, elementIndex), ...old.slice(elementIndex + 1)];
      }
      return newValues;
    });
  };

  const handleFormSubmit = async (evt: FormEvent) => {
    try {
      evt.preventDefault();
      const formData = new FormData();

      if (avatarInputRef.current?.files && avatarInputRef.current?.files.length > 0) {
        formData.append('avatar', avatarInputRef.current.files[0]);
      }

      if (name) {
        formData.append('name', name);
      }
      if (description) {
        formData.append('description', description);
      }
      if (status) {
        formData.append(`${currentUser?.role === UserRole.Trainer ? 'isReadyToPersonal' : 'isReadyToTraining'}`, status.toString());
      }

      trainingTypes.forEach((type) => {
        formData.append('trainingType', type);
      });

      if (location) {
        formData.append('location', location);
      }
      if (gender) {
        formData.append('gender', gender);
      }
      if (level) {
        formData.append('trainingLevel', level);
      }

      if (deleteAvatar) {
        formData.append('deleteAvatar', deleteAvatar.toString());
      }

      unwrapResult(await dispatch(updateUser({ id: currentUser?.id || '', data: formData })));
      setIsFormDisabled(true);
      setDeleteAvatar(false);
    } catch {
      setIsFormDisabled(false);
    }
  };

  const handleLogoutButtonCLick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    dropToken();
    dispatch(setCurrentUser(null));
    dispatch(setAuthStatus(AuthStatus.NoAuth));
  };

  const trainingTypesElements = Object.values(TrainingType).map((type, index) => (
    <div className="btn-checkbox" key={`training_type_${index}`}>
      <label>
        <input
          className="visually-hidden"
          type="checkbox"
          name="trainingType"
          value={type}
          checked={trainingTypes.includes(type)}
          onChange={hadleTrainingTypeInputChange}
          disabled={isFormDisabled}
        />
        <span className="btn-checkbox__btn">{type}</span>
      </label>
    </div>
  ));

  const locationOptionElements = METRO_STATIONS.map((value, index) => (
    <option key={`location_${index}`} value={value}>{value}</option>
  ));

  const genderOptionElements = Object.values(UserGender).map((value, index) => (
    <option key={`gender_${index}`} value={value}>{value}</option>
  ));

  const levelOptionElements = Object.values(TrainingLevel).map((value, index) => (
    <option key={`level_${index}`} value={value}>{value}</option>
  ));

  return (
    <section className="user-info-edit">
      <button className='btn-flat btn-flat--underlined' onClick={handleLogoutButtonCLick}>Выйти</button>
      <div className="user-info-edit__header">
        <div className="input-load-avatar">
          <label>
            <input
              ref={avatarInputRef}
              className="visually-hidden"
              type="file"
              name="user-photo-1"
              accept={Object.values(AllowedImageFormat).join(', ')}
              onChange={handleAvatarInputChange}
            />
            <span className="input-load-avatar__avatar">
              {
                loading
                ? <Loading />
                : <img src={avatar} alt="user avatar"/>
              }
            </span>
          </label>
        </div>
        {!isFormDisabled &&
          <div className="user-info-edit__controls">
            <button
              className="user-info-edit__control-btn"
              aria-label="обновить"
              onClick={handleUpdateAvatarButtonClick}
            >
              <svg width={16} height={16} aria-hidden="true">
                <use xlinkHref="#icon-change" />
              </svg>
            </button>
            <button
              className="user-info-edit__control-btn"
              aria-label="удалить"
              disabled={!currentUser.avatar}
              onClick={handleDeleteAvatarButtonClick}
            >
              <svg width={14} height={16} aria-hidden="true">
                <use xlinkHref="#icon-trash" />
              </svg>
            </button>
          </div>
        }
      </div>
      <span className="custom-input__error">
        {getResponseErrorMessage(responseError, 'avatar')}
      </span>
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
                  value={name ?? ''}
                  onChange={getInputChangeHandler<string | null, HTMLInputElement>(setName)}
                  disabled={isFormDisabled}
                />
              </span>
              <span className="custom-input__error">
                {getResponseErrorMessage(responseError, 'name')}
              </span>
            </label>
          </div>
          <div className={`custom-textarea ${isFormDisabled ? 'custom-textarea--readonly user-info__textarea' : 'user-info-edit__textarea'}`}>
            <label>
              <span className="custom-textarea__label">Описание</span>
              <textarea
                name="description"
                placeholder=" "
                value={description ?? ''}
                disabled={isFormDisabled}
                onChange={getInputChangeHandler<string | null, HTMLTextAreaElement>(setDescription)}
              />
              <span className="custom-input__error">
                {getResponseErrorMessage(responseError, 'description')}
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
                checked={status}
                disabled={isFormDisabled}
                onChange={handleStatusCheckboxChange}
              />
              <span className="custom-toggle__icon">
                <svg width={9} height={6} aria-hidden="true">
                  <use xlinkHref="#arrow-check" />
                </svg>
              </span>
              <span className="custom-toggle__label">
                {currentUser?.role && currentUser.role === UserRole.Trainer ? 'Готов тренировать' : 'Готов к тренировке'}
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
            {getResponseErrorMessage(responseError, 'type')}
          </span>
        </div>
        <div className={isFormDisabled ? 'custom-edit--readonly user-info__edit' : 'user-info-edit__select'}>
          <span className="custom-select__label">Локация</span>
          <select
            className="custom-select__button"
            id="location_select"
            value={location ?? ''}
            onChange={getInputChangeHandler<string | null, HTMLSelectElement>(setLocation)}
            disabled={isFormDisabled}
          >
            {locationOptionElements}
          </select>
          <span className="custom-input__error">
            {getResponseErrorMessage(responseError, 'location')}
          </span>
        </div>
        <div className={isFormDisabled ? 'custom-edit--readonly user-info__edit' : 'user-info-edit__select'}>
          <span className="custom-select__label">Пол</span>
          <select
            className="custom-select__button"
            id="gender_select"
            value={gender ?? ''}
            onChange={getInputChangeHandler<UserGender | null, HTMLSelectElement>(setGender)}
            disabled={isFormDisabled}
          >
            {genderOptionElements}
          </select>
          <span className="custom-input__error">
            {getResponseErrorMessage(responseError, 'gender')}
          </span>
        </div>
        <div className={isFormDisabled ? 'custom-edit--readonly user-info__edit' : 'user-info-edit__select'}>
          <span className="custom-select__label">Уровень</span>
          <select
            className="custom-select__button"
            id="level_select"
            value={level ?? ''}
            onChange={getInputChangeHandler<TrainingLevel | null, HTMLSelectElement>(setLevel)}
            disabled={isFormDisabled}
          >
            {levelOptionElements}
          </select>
          <span className="custom-input__error">
            {getResponseErrorMessage(responseError, 'level')}
          </span>
        </div>
      </form>
    </section>
  );
}
