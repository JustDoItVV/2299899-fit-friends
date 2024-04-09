export default function PopupUserMap(): JSX.Element {
  return (
    <div className="wrapper">
      <main>
        <div className="popup-form popup-form--map">
          <section className="popup">
            <div className="popup__wrapper popup__wrapper--map">
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
          </section>
        </div>
      </main>
    </div>
  );
}
