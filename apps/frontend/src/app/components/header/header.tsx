import { Link } from 'react-router-dom';

import { FrontendRoute } from '@2299899-fit-friends/types';

export default function Header(): JSX.Element {
  return (
    <header className="header">
      <div className="container">
        <Link className="header__logo" to={FrontendRoute.Main} aria-label="Переход на главную">
          <svg width={187} height={70} aria-hidden="true">
            <use xlinkHref="#logo" />
          </svg>
        </Link>
        <nav className="main-nav">
          <ul className="main-nav__list">
            <li className="main-nav__item">
              <Link className="main-nav__link is-active" to={FrontendRoute.Main} aria-label="На главную">
                <svg width={18} height={18} aria-hidden="true">
                  <use xlinkHref="#icon-home" />
                </svg>
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className="main-nav__link" to={FrontendRoute.Personal} aria-label="Личный кабинет">
                <svg width={16} height={18} aria-hidden="true">
                  <use xlinkHref="#icon-user" />
                </svg>
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className="main-nav__link" to={`${FrontendRoute.Personal}${FrontendRoute.Friends}`} aria-label="Друзья">
                <svg width={22} height={16} aria-hidden="true">
                  <use xlinkHref="#icon-friends" />
                </svg>
              </Link>
            </li>
            <li className="main-nav__item main-nav__item--notifications">
              <Link className="main-nav__link" to={`${FrontendRoute.Personal}${FrontendRoute.Notifications}`} aria-label="Уведомления">
                <svg width={14} height={18} aria-hidden="true">
                  <use xlinkHref="#icon-notification" />
                </svg>
              </Link>
              <div className="main-nav__dropdown">
                <p className="main-nav__label">Оповещения</p>
                <ul className="main-nav__sublist">
                  <li className="main-nav__subitem">
                    <button className="notification is-active">
                      <p className="notification__text">
                        Катерина пригласила вас на&nbsp;тренировку
                      </p>
                      <time
                        className="notification__time"
                        dateTime="2023-12-23 12:35"
                      >
                        23 декабря, 12:35
                      </time>
                    </button>
                  </li>
                  <li className="main-nav__subitem">
                    <button className="notification is-active">
                      <p className="notification__text">
                        Никита отклонил приглашение на&nbsp;совместную тренировку
                      </p>
                      <time className="notification__time" dateTime="2023-12-22 09:22">
                        22 декабря, 09:22
                      </time>
                    </button>
                  </li>
                  <li className="main-nav__subitem">
                    <button className="notification is-active">
                      <p className="notification__text">Татьяна добавила вас в&nbsp;друзья</p>
                      <time className="notification__time" dateTime="2023-12-18 18:50">
                        18 декабря, 18:50
                      </time>
                    </button>
                  </li>
                  <li className="main-nav__subitem">
                    <button className="notification">
                      <p className="notification__text">Наталья приняла приглашение на&nbsp;совместную тренировку</p>
                      <time className="notification__time" dateTime="2023-12-14 08:15">14 декабря, 08:15</time>
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
        <div className="search">
          <form action="#" method="get">
            <label>
              <span className="search__label">Поиск</span>
              <input type="search" name="search" />
              <svg
                className="search__icon"
                width={20}
                height={20}
                aria-hidden="true"
              >
                <use xlinkHref="#icon-search" />
              </svg>
            </label>
            <ul className="search__list">
              <li className="search__item">
                <span className="search__link">
                  Бокс
                </span>
              </li>
              <li className="search__item">
                <span className="search__link is-active">
                  Бег
                </span>
              </li>
              <li className="search__item">
                <span className="search__link">
                  Аэробика
                </span>
              </li>
              <li className="search__item">
                <span className="search__link">
                  Text
                </span>
              </li>
              <li className="search__item">
                <span className="search__link">
                  Text
                </span>
              </li>
              <li className="search__item">
                <span className="search__link">
                  Text
                </span>
              </li>
              <li className="search__item">
                <span className="search__link">
                  Text
                </span>
              </li>
              <li className="search__item">
                <span className="search__link">
                  Text
                </span>
              </li>
              <li className="search__item">
                <span className="search__link">
                  Text
                </span>
              </li>
              <li className="search__item">
                <span className="search__link">
                  Text
                </span>
              </li>
              <li className="search__item">
                <span className="search__link">
                  Text
                </span>
              </li>
              <li className="search__item">
                <span className="search__link">
                  Text
                </span>
              </li>
              <li className="search__item">
                <span className="search__link">
                  Text
                </span>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </header>
  );
}
