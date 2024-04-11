import './card-user-info.css';

import classnames from 'classnames';
import { ChangeEvent, useEffect, useState } from 'react';

import { SliderBlockItems } from '@2299899-fit-friends/consts';
import {
    addFriend, deleteFriend, fetchTrainingsCatalog, fetchUserAvatar, selectCurrentUser, selectUser,
    subscribeToTrainer, unsubscribeFromTrainer, useAppDispatch, useAppSelector, useFetchFileUrl
} from '@2299899-fit-friends/frontend-core';
import { QueryPagination, UserRole } from '@2299899-fit-friends/types';

import PopupCertificates from '../../popups/popup-certificates/popup-certificates';
import PopupUserMap from '../../popups/popup-user-map/popup-user-map';
import SliderBlock from '../../slider-block/slider-block';
import CardTraining from '../card-training/card-training';

export default function CardUserInfo(): JSX.Element {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const currentUser = useAppSelector(selectCurrentUser);
  const avatarUrl = useFetchFileUrl(fetchUserAvatar, { id: user?.id }, 'img/content/placeholder.png', [user]);
  const [query, setQuery] = useState<QueryPagination>({});

  useEffect(() => {
    setQuery({ userId: user?.id });
  }, [user]);

  const handleAddFriendButtonClick = () => {
    if (user?.id) {
      if (currentUser?.id && user?.friends?.includes(currentUser.id)) {
        dispatch(deleteFriend(user.id));
      } else {
        dispatch(addFriend(user.id));
      }
    }
  };

  // const handleWantPersonalButtonClick = () => {

  // };

  const handleSubscribeInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (user?.id) {
      const checked = evt.currentTarget.checked;
      if (checked) {
        dispatch(unsubscribeFromTrainer(user.id));
      } else {
        dispatch(subscribeToTrainer(user.id));
      }
    }
  };

  const hashtagsElelments = user?.trainingType.map((type, index) => (
    <li className='user-card-coach__hashtag-item' key={`hashtag_type_${index}`}>
      <div className="hashtag">
        <span>#{type}</span>
      </div>
    </li>
  ));

  return (
    <section className='user-card-coach'>
      <h1 className="visually-hidden">Карточка пользователя</h1>
      <div className='user-card-coach__wrapper'>
        <div className='user-card-coach__card'>
          <div className='user-card-coach__content'>
            <div className='user-card-coach__head'>
              <h2 className='user-card-coach__title'>{user?.name}</h2>
            </div>
            <div className='user-card-coach__label'>
              <PopupUserMap trigger={
                <button type='button'>
                  <svg
                    className="user-card-coach__icon-location"
                    width={12}
                    height={14}
                    aria-hidden="true"
                  >
                    <use xlinkHref="#icon-location" />
                  </svg>
                  <span>{user?.location}</span>
                </button>
              } />
            </div>
            {
              user?.role === UserRole.Trainer &&
              <div className="user-card-coach__status-container">
                <div className="user-card-coach__status user-card-coach__status--tag">
                  <svg
                    className="user-card-coach__icon-cup"
                    width={12}
                    height={13}
                    aria-hidden="true"
                  >
                    <use xlinkHref="#icon-cup" />
                  </svg>
                  <span>Тренер</span>
                </div>
                <div className={classnames(
                  'user-card-coach__status',
                  { 'user-card-coach__status--check': user.isReadyToTraining }
                )}>
                  <span>{user.isReadyToTraining ? 'Г' : 'Не г'}Готов тренировать</span>
                </div>
              </div>
            }
            {
              user?.role === UserRole.User &&
              <div className="user-card__status">
                <span>{user.isReadyToPersonal ? 'Г' : 'Не г'}отов к тренировке</span>
              </div>
            }
            <div className='user-card-coach__text'>
              <p>
                {user?.description}
              </p>
            </div>
            {
              user?.role === UserRole.Trainer &&
              <PopupCertificates trigger={
                <button className="btn-flat user-card-coach__sertificate" type="button">
                  <svg width={12} height={13} aria-hidden="true">
                    <use xlinkHref="#icon-teacher" />
                  </svg>
                  <span>Посмотреть сертификаты</span>
                </button>
              }/>
            }
            <ul className='user-card-coach__hashtag-list'>
              {hashtagsElelments}
            </ul>
            <button
              className={classnames(
                `btn user-card-coach__btn`,
                { 'btn--outlined': currentUser?.id && user?.friends?.includes(currentUser?.id) }
              )}
              type="button"
              onClick={handleAddFriendButtonClick}
              disabled={currentUser?.role === UserRole.Trainer || currentUser?.id === user?.id}
            >
              {
                currentUser?.id && user?.friends?.includes(currentUser?.id)
                ? 'Удалить из друзей'
                : 'Добавить в друзья'
              }
            </button>
          </div>
          <div className='user-card-coach__gallary'>
            <ul className='user-card-coach__gallary-list'>
              <li className='user-card-coach__gallary-item'>
                <img
                  src={avatarUrl}
                  width={334}
                  height={573}
                  alt="photo1"
                />
              </li>
              <li className='user-card-coach__gallary-item'>
                <img
                  src={avatarUrl}
                  width={334}
                  height={573}
                  alt="photo2"
                />
              </li>
            </ul>
          </div>
        </div>
        {
          user?.role === UserRole.Trainer && user.id &&
          <SliderBlock
            title='Тренировки'
            classNamePrefix='popular-trainings'
            fetch={fetchTrainingsCatalog}
            query={query}
            component={CardTraining}
            itemsPerPage={SliderBlockItems.TrainingPageVisible}
            controls={true}
            maxItems={8}
            preload={true}
            dots={false}
          />
        }
        {
          user?.role === UserRole.Trainer &&
          <form className="user-card-coach__training-form">
            <button
              className="btn user-card-coach__btn-training"
              type="button"
              // onClick={handleWantPersonalButtonClick}
              disabled={!currentUser?.id || !user.friends?.includes(currentUser.id) || !user.isReadyToPersonal}
            >
              Хочу персональную тренировку
            </button>
            <div className="user-card-coach__training-check">
              <div className="custom-toggle custom-toggle--checkbox">
                <label>
                  <input
                    type="checkbox"
                    defaultValue="user-agreement-1"
                    name="user-agreement"
                    defaultChecked={!!currentUser?.id && user.emailSubscribtions?.includes(currentUser?.id)}
                    onChange={handleSubscribeInputChange}
                  />
                  <span className="custom-toggle__icon">
                    <svg width={9} height={6} aria-hidden="true">
                      <use xlinkHref="#arrow-check" />
                    </svg>
                  </span>
                  <span className="custom-toggle__label">
                    Получать уведомление на почту о новой тренировке
                  </span>
                </label>
              </div>
            </div>
          </form>
        }
      </div>
    </section>
  );
}
