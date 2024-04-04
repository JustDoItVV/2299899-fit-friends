import { Helmet } from 'react-helmet-async';

export default function InternalServerErrorPage(): JSX.Element {
  return (
    <div className="wrapper">
      <Helmet><title>500. Внутренняя ошибка сервера — FitFriends</title></Helmet>
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
                <h1 className="popup-form__title">500</h1>
              </div>
              <div className="popup-form__form">
                <h1 className="">Внутренняя ошибка сервера</h1>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
