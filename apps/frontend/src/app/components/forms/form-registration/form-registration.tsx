import { ChangeEvent, FormEvent, useRef, useState } from 'react';

import { METRO_STATIONS } from '@2299899-fit-friends/consts';
import {
    registerUser, selectResponseError, useAppDispatch, useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { getResponseErrorMessage } from '@2299899-fit-friends/helpers';
import { UserGender, UserRole } from '@2299899-fit-friends/types';

export default function RegistrationForm(): JSX.Element {
  const dispatch = useAppDispatch();
  const responseError = useAppSelector(selectResponseError);

  const [avatarPreview, setAvatarPreview] = useState<JSX.Element | null>(null);
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  const [location, setLocation] = useState<string>(METRO_STATIONS[0]);
  const [password, setPassword] = useState<string>('');
  const [gender, setGender] = useState<UserGender>(UserGender.Male);
  const [role, setRole] = useState<UserRole>(UserRole.Trainer);
  const [agreement, setAgreement] = useState<boolean>(false);

  const handleAvatarInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget.files) {
      const file = evt.currentTarget.files[0];
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(
        <img className="input-load-avatar__btn" src={imageUrl} alt="Preview" />
      );
    } else {
      setAvatarPreview(null);
    }
  };

  const getInputChangeHandler =
    <T, V extends HTMLInputElement | HTMLSelectElement>(
      setState: React.Dispatch<React.SetStateAction<T>>
    ) =>
    (evt: ChangeEvent<V>) => {
      if (evt.currentTarget) {
        setState(evt.currentTarget.value as T);
      }
    };

  const handleAgreementChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setAgreement(evt.currentTarget.checked);
  };

  const handleFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formData = new FormData();

    if (avatarRef.current?.files && avatarRef.current?.files.length !== 0) {
      formData.append('avatar', avatarRef.current.files[0]);
    }

    formData.append('name', name);
    formData.append('email', email);
    formData.append('birthdate', birthdate);
    formData.append('location', location);
    formData.append('password', password);
    formData.append('gender', gender);
    formData.append('role', role);

    dispatch(registerUser(formData));
  };

  return (
    <form method="post" onSubmit={handleFormSubmit}>
      <div className="sign-up">
        <div className="sign-up__load-photo">
          <div className="input-load-avatar">
            <label>
              <input
                ref={avatarRef}
                className="visually-hidden"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleAvatarInputChange}
              />
              {avatarPreview || (
                <span className="input-load-avatar__btn">
                  <svg width={20} height={20} aria-hidden="true">
                    <use xlinkHref="#icon-import" />
                  </svg>
                </span>
              )}
            </label>
          </div>
          <div className="sign-up__description">
            <h2 className="sign-up__legend">Загрузите фото профиля</h2>
            <span className="sign-up__text">
              JPG, PNG, оптимальный размер 100×100&nbsp;px
            </span>
          </div>
        </div>
        <div className="sign-up__data">
          <div className="custom-input">
            <label>
              <span className="custom-input__label">Имя</span>
              <span className="custom-input__wrapper">
                <input
                  type="text"
                  name="name"
                  onChange={getInputChangeHandler(setName)}
                />
              </span>
              <span className="custom-input__error">
                {getResponseErrorMessage(responseError, 'name')}
              </span>
            </label>
          </div>
          <div className="custom-input">
            <label>
              <span className="custom-input__label">E-mail</span>
              <span className="custom-input__wrapper">
                <input
                  type="email"
                  name="email"
                  onChange={getInputChangeHandler(setEmail)}
                />
              </span>
              <span className="custom-input__error">
                {getResponseErrorMessage(responseError, 'email')}
              </span>
            </label>
          </div>
          <div className="custom-input">
            <label>
              <span className="custom-input__label">Дата рождения</span>
              <span className="custom-input__wrapper">
                <input
                  type="date"
                  name="birthday"
                  max="2099-12-31"
                  onChange={getInputChangeHandler(setBirthdate)}
                />
              </span>
              <span className="custom-input__error">
                {getResponseErrorMessage(responseError, 'birthdate')}
              </span>
            </label>
          </div>
          <div className="custom-input">
            <label>
              <span className="custom-input__label">Ваша локация</span>
              <span className="custom-input__wrapper">
                <select
                  className="custom-select__button"
                  id="location_select"
                  onChange={getInputChangeHandler(setLocation)}
                >
                  <option>Пионерская</option>
                  <option>Петроградская</option>
                  <option>Удельная</option>
                  <option>Звёздная</option>
                  <option>Спортивная</option>
                </select>
              </span>
              <span className="custom-input__error">
                {getResponseErrorMessage(responseError, 'location')}
              </span>
            </label>
          </div>
          <div className="custom-input">
            <label>
              <span className="custom-input__label">Пароль</span>
              <span className="custom-input__wrapper">
                <input
                  type="password"
                  name="password"
                  autoComplete="off"
                  onChange={getInputChangeHandler(setPassword)}
                />
              </span>
              <span className="custom-input__error">
                {getResponseErrorMessage(responseError, 'password')}
              </span>
            </label>
          </div>
          <div className="sign-up__radio">
            <span className="sign-up__label">Пол</span>
            <div className="custom-toggle-radio custom-toggle-radio--big">
              <div className="custom-toggle-radio__block">
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value={UserGender.Male}
                    defaultChecked
                    onChange={getInputChangeHandler(setGender)}
                  />
                  <span className="custom-toggle-radio__icon" />
                  <span className="custom-toggle-radio__label">Мужской</span>
                </label>
              </div>
              <div className="custom-toggle-radio__block">
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value={UserGender.Female}
                    onChange={getInputChangeHandler(setGender)}
                  />
                  <span className="custom-toggle-radio__icon" />
                  <span className="custom-toggle-radio__label">Женский</span>
                </label>
              </div>
              <div className="custom-toggle-radio__block">
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value={UserGender.Other}
                    onChange={getInputChangeHandler(setGender)}
                  />
                  <span className="custom-toggle-radio__icon" />
                  <span className="custom-toggle-radio__label">Неважно</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="sign-up__role">
          <h2 className="sign-up__legend">Выберите роль</h2>
          <div className="role-selector sign-up__role-selector">
            <div className="role-btn">
              <label>
                <input
                  className="visually-hidden"
                  type="radio"
                  name="role"
                  value={UserRole.Trainer}
                  defaultChecked
                  onChange={getInputChangeHandler(setRole)}
                />
                <span className="role-btn__icon">
                  <svg width={12} height={13} aria-hidden="true">
                    <use xlinkHref="#icon-cup" />
                  </svg>
                </span>
                <span className="role-btn__btn">Я хочу тренировать</span>
              </label>
            </div>
            <div className="role-btn">
              <label>
                <input
                  className="visually-hidden"
                  type="radio"
                  name="role"
                  value={UserRole.User}
                  onChange={getInputChangeHandler(setRole)}
                />
                <span className="role-btn__icon">
                  <svg width={12} height={13} aria-hidden="true">
                    <use xlinkHref="#icon-weight" />
                  </svg>
                </span>
                <span className="role-btn__btn">Я хочу тренироваться</span>
              </label>
            </div>
          </div>
        </div>
        <div className="sign-up__checkbox">
          <label>
            <input
              type="checkbox"
              defaultValue="user-agreement"
              name="user-agreement"
              onChange={handleAgreementChange}
            />
            <span className="sign-up__checkbox-icon">
              <svg width={9} height={6} aria-hidden="true">
                <use xlinkHref="#arrow-check" />
              </svg>
            </span>
            <span className="sign-up__checkbox-label">
              Я соглашаюсь с <span>политикой конфиденциальности</span> компании
            </span>
          </label>
        </div>
        <button
          className="btn sign-up__button"
          type="submit"
          disabled={!name || !email || !birthdate || !password || !agreement}
        >
          Продолжить
        </button>
      </div>
    </form>
  );
}
