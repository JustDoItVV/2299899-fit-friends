import { Helmet } from 'react-helmet-async';

import PopupError from '../../components/popups/popup-error/popup-error';

export default function NotFoundPage(): JSX.Element {
  return (
    <div className="wrapper">
      <Helmet><title>404. Страница не найдена — FitFriends</title></Helmet>
      <main>
        <div className="background-logo">
          <svg className="background-logo__logo" width={750} height={284} aria-hidden="true">
            <use xlinkHref="#logo-big" />
          </svg>
          <svg className="background-logo__icon" width={343} height={343} aria-hidden="true">
            <use xlinkHref="#icon-logotype" />
          </svg>
        </div>
        <PopupError statusCode={404} />
      </main>
    </div>
  );
}
