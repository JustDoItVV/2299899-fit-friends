import { Link } from 'react-router-dom';

import { FrontendRoute } from '@2299899-fit-friends/types';

export default function AccountPanelTrainer(): JSX.Element {
  return (
    <div className="personal-account-coach__navigation">
      <Link
        className="thumbnail-link thumbnail-link--theme-light"
        to={`/${FrontendRoute.Account}/${FrontendRoute.Trainings}`}
      >
        <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
          <svg width={30} height={26} aria-hidden="true">
            <use xlinkHref="#icon-flash" />
          </svg>
        </div>
        <span className="thumbnail-link__text">
          Мои тренировки
        </span>
      </Link>
      <Link
        className="thumbnail-link thumbnail-link--theme-light"
        to={`/${FrontendRoute.Account}/${FrontendRoute.Create}`}
      >
        <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
          <svg width={30} height={26} aria-hidden="true">
            <use xlinkHref="#icon-add" />
          </svg>
        </div>
        <span className="thumbnail-link__text">
          Создать тренировку
        </span>
      </Link>
      <Link
        className="thumbnail-link thumbnail-link--theme-light"
        to={`/${FrontendRoute.Account}/${FrontendRoute.Friends}`}
      >
        <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
          <svg width={30} height={26} aria-hidden="true">
            <use xlinkHref="#icon-friends" />
          </svg>
        </div>
        <span className="thumbnail-link__text">Мои друзья</span>
      </Link>
      <Link
        className="thumbnail-link thumbnail-link--theme-light"
        to={`/${FrontendRoute.Account}/${FrontendRoute.Orders}`}
      >
        <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
          <svg width={30} height={26} aria-hidden="true">
            <use xlinkHref="#icon-bag" />
          </svg>
        </div>
        <span className="thumbnail-link__text">Мои заказы</span>
      </Link>
      <div className="personal-account-coach__calendar">
        <div className="thumbnail-spec-gym">
          <div className="thumbnail-spec-gym__image">
            <picture>
              <source
                type="image/webp"
                srcSet="img/content/thumbnails/nearest-gym-01.webp, img/content/thumbnails/nearest-gym-01@2x.webp 2x"
              />
              <img
                src="img/content/thumbnails/nearest-gym-01.jpg"
                srcSet="img/content/thumbnails/nearest-gym-01@2x.jpg 2x"
                width={330}
                height={190}
                alt=""
              />
            </picture>
          </div>
          <div
            className="thumbnail-spec-gym__header"
            style={{ alignContent: 'center' }}
          >
            <h3 className="thumbnail-spec-gym__title">
              Скоро тут будет интересно
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
