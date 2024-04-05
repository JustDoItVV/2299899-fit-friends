import { memo, useEffect, useState } from 'react';

import { CatalogItem, fetchUserAvatar, useAppDispatch } from '@2299899-fit-friends/frontend-core';
import { User } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';

type FriendsCatalogCardProps = {
  item: CatalogItem;
};

export default memo(function FriendsCatalogCard({ item }: FriendsCatalogCardProps): JSX.Element {
  const user = item as User;
  const dispatch = useAppDispatch();
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const image = unwrapResult(await dispatch(fetchUserAvatar(user.id || '')));
        setImageUrl(image);
      } catch {
        setImageUrl('img/content/placeholder.png');
      }
    };

    fetchAvatar();
  }, [dispatch, user]);

  const hashtagElements = user.trainingType.map((type, index) => (
    <li key={`${user.id}_hashtag_${index}`}>
      <div className="hashtag thumbnail-friend__hashtag">
        <span>#{type}</span>
      </div>
    </li>
  ));

  return (
    <li className="friends-list__item">
      <div className="thumbnail-friend">
        <div className="thumbnail-friend__info thumbnail-friend__info--theme-light">
          <div className="thumbnail-friend__image-status">
            <div className="thumbnail-friend__image">
              <picture>
                <img
                  src={imageUrl}
                  width={78}
                  height={78}
                  alt={user.name}
                />
              </picture>
            </div>
          </div>
          <div className="thumbnail-friend__header">
            <h2 className="thumbnail-friend__name">{user.name}</h2>
            <div className="thumbnail-friend__location">
              <svg width={14} height={16} aria-hidden="true">
                <use xlinkHref="#icon-location" />
              </svg>
              <address className="thumbnail-friend__location-address">
                {user.location}
              </address>
            </div>
          </div>
          <ul className="thumbnail-friend__training-types-list">
            {hashtagElements}
          </ul>
          <div className="thumbnail-friend__activity-bar">
            <div className="thumbnail-friend__ready-status thumbnail-friend__ready-status--is-ready">
              <span>{user.isReadyToTraining ? 'Г' : 'Не г'}отов к&nbsp;тренировке</span>
            </div>
          </div>
        </div>
        {/* <div className="thumbnail-friend__request-status thumbnail-friend__request-status--role-user">
          <p className="thumbnail-friend__request-text">
            Запрос на&nbsp;персональную тренировку
          </p>
          <div className="thumbnail-friend__button-wrapper">
            <button
              className="btn btn--medium btn--dark-bg thumbnail-friend__button"
              type="button"
            >
              Принять
            </button>
            <button
              className="btn btn--medium btn--outlined btn--dark-bg thumbnail-friend__button"
              type="button"
            >
              Отклонить
            </button>
          </div>
        </div> */}
      </div>
    </li>
  );
});
