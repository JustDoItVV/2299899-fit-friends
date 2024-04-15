import { Link } from 'react-router-dom';

import { ResponseErrorMessage } from '@2299899-fit-friends/consts';
import { FrontendRoute } from '@2299899-fit-friends/types';

type PopupErrorProps = {
  statusCode: number;
};

export default function PopupError({ statusCode }: PopupErrorProps): JSX.Element {
  return (
    <div className="popup-form popup-form--sign-in">
      <div className="popup-form__wrapper">
        <div className="popup-form__content">
          <div className="popup-form__title-wrapper">
            <h1 className="popup-form__title">{statusCode}</h1>
          </div>
          <div className="popup-form__form">
            <h1 className="">{ResponseErrorMessage.get(statusCode)}</h1>
            <Link className='btn' to={`/${FrontendRoute.Main}`}>
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
