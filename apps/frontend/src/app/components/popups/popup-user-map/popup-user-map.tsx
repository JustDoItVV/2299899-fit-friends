import { useRef } from 'react';
import Popup from 'reactjs-popup';
import { PopupActions } from 'reactjs-popup/dist/types';

type PopupUserMapProps = {
  trigger: JSX.Element,
};

export default function PopupUserMap(props: PopupUserMapProps): JSX.Element {
  const { trigger } = props;
  const popupRef = useRef<PopupActions | null>(null);

  const handleCloseButtonClick = () => {
    if (popupRef.current) {
      popupRef.current.close();
    }
  }

  return (
    <Popup
      ref={popupRef}
      modal
      trigger={trigger}
      lockScroll={true}
      // onClose={handleClosePopup}
    >
      <div className="">
        <div className="popup-head popup-head--address">
          <h2 className="popup-head__header">Валерия</h2>
          <p className="popup-head__address">
            <svg
              className="popup-head__icon-location"
              width={12}
              height={14}
              aria-hidden="true"
            >
              <use xlinkHref="#icon-location" />
            </svg>
            <span>м. Адмиралтейская</span>
          </p>
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
        <div className="popup__content-map">
          <div className="popup__map">
            <picture>
              <source
                type="image/webp"
                srcSet="img/content/popup/map.webp, img/content/popup/map@2x.webp 2x"
              />
              <img
                src="img/content/popup/map.jpg"
                srcSet="img/content/popup/map@2x.jpg 2x"
                width={1160}
                height={623}
                alt=""
              />
            </picture>
            <div className="popup__pin popup__pin--user">
              <svg
                className="popup__pin-icon"
                width={40}
                height={49}
                aria-hidden="true"
              >
                <use xlinkHref="#icon-pin-user" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
