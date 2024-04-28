import './header.css';

import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

import {
    deleteNotification, fetchNotifications, useAppDispatch
} from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, Notification, TrainingType } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';

type HeaderProps = {
  page: string;
};

export default function Header(props: HeaderProps): JSX.Element {
  const { page } = props;
  const dispatch = useAppDispatch();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsElements, setNotificationsElements] = useState<JSX.Element[]>([]);

  const handleNotificationsOpen = async () => {
    const data = unwrapResult(await dispatch(fetchNotifications()));
    setNotifications(data);
  };

  const handleNotificationClick = useCallback((evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    if (evt.currentTarget.dataset.id) {
      dispatch(deleteNotification(evt.currentTarget.dataset.id));
      evt.currentTarget.classList.toggle('is-active');
    }
  }, [dispatch]);

  useEffect(() => {
    setNotificationsElements(notifications.map((notification, index) => (
      <li className="main-nav__subitem" key={`notification_item_${index}`}>
        <Link className="notification is-active" to="*" data-id={notification.id} onClick={handleNotificationClick}>
          <p className="notification__text">
            {notification.text}
          </p>
          <time
            className="notification__time"
            dateTime={notification.createdAt?.toString() ?? ''}
          >
            {notification.createdAt?.toString() ?? ''}
          </time>
        </Link>
      </li>
    )));
  }, [page, notifications, handleNotificationClick]);

  const searchItemsElements = Object.values(TrainingType).map((type, index) => (
    <li className="search__item" key={`search_item_${index}`}>
      <span className="search__link">
        Бокс
      </span>
    </li>
  ));

  return (
    <header className="header">
      <div className="container">
        <Link className="header__logo" to={`/${FrontendRoute.Main}`} aria-label="Переход на главную">
          <svg width={187} height={70} aria-hidden="true">
            <use xlinkHref="#logo" />
          </svg>
        </Link>
        <nav className="main-nav">
          <ul className="main-nav__list">
            <li className="main-nav__item">
              <Link className={`main-nav__link ${page === FrontendRoute.Main ? 'is-active' : ''}`} to={`/${FrontendRoute.Main}`} aria-label="На главную">
                <svg width={18} height={18} aria-hidden="true">
                  <use xlinkHref="#icon-home" />
                </svg>
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className={`main-nav__link ${page === FrontendRoute.Account ? 'is-active' : ''}`} to={`/${FrontendRoute.Account}`} aria-label="Личный кабинет">
                <svg width={16} height={18} aria-hidden="true">
                  <use xlinkHref="#icon-user" />
                </svg>
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className={`main-nav__link ${page === FrontendRoute.Friends ? 'is-active' : ''}`} to={`/${FrontendRoute.Account}/${FrontendRoute.Friends}`} aria-label="Друзья">
                <svg width={22} height={16} aria-hidden="true">
                  <use xlinkHref="#icon-friends" />
                </svg>
              </Link>
            </li>
            <li className="main-nav__item main-nav__item--notifications">
              <Popup trigger={
                <button className="main-nav__link" aria-label="Уведомления" data-testid='header-notifications-button-trigger'>
                  <svg width={14} height={18} aria-hidden="true">
                    <use xlinkHref="#icon-notification" />
                  </svg>
                </button>
              } className='popup-notifications' onOpen={handleNotificationsOpen}>
                  <p className="main-nav__label">Оповещения</p>
                  <ul className="main-nav__sublist" data-testid='header-notifications-list'>
                    {
                      notificationsElements.length > 0
                      ? notificationsElements
                      : <p>Нет оповещений</p>
                    }
                  </ul>
              </Popup>
            </li>
          </ul>
        </nav>
        <div className="search">
          <form action='*'>
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
              {searchItemsElements}
            </ul>
          </form>
        </div>
      </div>
    </header>
  );
}
