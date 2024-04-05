import { ResponseErrorMessage } from '@2299899-fit-friends/consts';

type ErrorPopupProps = {
  statusCode: number;
};

export default function ErrorPopup({ statusCode }: ErrorPopupProps): JSX.Element {
  return (
    <div className="popup-form popup-form--sign-in">
      <div className="popup-form__wrapper">
        <div className="popup-form__content">
          <div className="popup-form__title-wrapper">
            <h1 className="popup-form__title">{statusCode}</h1>
          </div>
          <div className="popup-form__form">
            <h1 className="">{ResponseErrorMessage.get(statusCode)}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
