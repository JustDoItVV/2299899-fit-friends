import { FormEvent, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

import { EMAIL_ERROR_CODES, PASSWORD_ERROR_CODES } from '@2299899-fit-friends/consts';
import { loginUserAction, selectResponseError } from '@2299899-fit-friends/storage';

import { useAppDispatch, useAppSelector } from '../../components/hooks';

export default function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const responseError = useAppSelector(selectResponseError);

  const handleFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (emailRef.current !== null && passwordRef.current !== null) {
      dispatch(loginUserAction({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      }));
    }
  };

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

    return message
      .filter((item) => item.toLowerCase().includes(field))
      .join(', ');
  };


  return (
    <div className="wrapper">
      <Helmet><title>Войти — FitFriends</title></Helmet>
      <main>
        <div className="background-logo">
          <svg className="background-logo__logo" width={750} height={284} aria-hidden="true">
            <use xlinkHref="#logo-big" />
          </svg>
          <svg className="background-logo__icon" width={343} height={343} aria-hidden="true">
            <use xlinkHref="#icon-logotype" />
          </svg>
        </div>
        <div className="popup-form popup-form--sign-in">
          <div className="popup-form__wrapper">
            <div className="popup-form__content">
              <div className="popup-form__title-wrapper">
                <h1 className="popup-form__title">Вход</h1>
              </div>
              <div className="popup-form__form">
                <form method="post" onSubmit={handleFormSubmit}>
                  <div className="sign-in">
                    <div className="custom-input sign-in__input">
                      <label>
                        <span className="custom-input__label">E-mail</span>
                        <span className="custom-input__wrapper">
                          <input ref={emailRef} type="email" name="email"/>
                        </span>
                        <span className="custom-input__error">
                          {getResponseErrorMessage(
                            EMAIL_ERROR_CODES,
                            responseError?.statusCode,
                            responseError?.message,
                            'email'
                          )}
                        </span>
                      </label>
                    </div>
                    <div className="custom-input sign-in__input">
                      <label>
                        <span className="custom-input__label">Пароль</span>
                        <span className="custom-input__wrapper">
                          <input ref={passwordRef} type="password" name="password" />
                        </span>
                        <span className="custom-input__error">
                          {getResponseErrorMessage(
                            PASSWORD_ERROR_CODES,
                            responseError?.statusCode,
                            responseError?.message,
                            'password'
                          )}
                        </span>
                      </label>
                    </div>
                    <button className="btn sign-in__button" type="submit">
                      Продолжить
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
