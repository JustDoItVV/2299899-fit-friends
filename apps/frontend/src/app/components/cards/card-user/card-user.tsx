import './card-user.css';

import classnames from 'classnames';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { PlaceholderPath } from '@2299899-fit-friends/consts';
import { CatalogItem, fetchUserAvatar, useFetchFileUrl } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, User, UserRole } from '@2299899-fit-friends/types';

import Loading from '../../loading/loading';

type CardUserProps = {
  item: CatalogItem;
};

export default memo(function CardUser({ item }: CardUserProps): JSX.Element {
  const user = item as User;
  const { fileUrl: thumbnailUrl, loading } = useFetchFileUrl(
    fetchUserAvatar,
    { id: user.id },
    PlaceholderPath.Image,
    [user],
  );

  const hashtagElements = user.trainingType.map((type, index) => (
    <li className="thumbnail-user__hashtags-item" key={`user_type_hashtag_${index}`}>
      <div className="hashtag thumbnail-user__hashtag">
        <span>#{type}</span>
      </div>
    </li>
  ));

  return (
    <div className="users-catalog__item">
      <div className={classnames(
        'thumbnail-user',
        {
          'thumbnail-user--role-user': user.role === UserRole.User,
          'thumbnail-user--role-coach': user.role === UserRole.Trainer,
        }
      )}>
        <div className="thumbnail-user__image">
          <picture>
            {
              loading
              ?
              <Loading />
              :
              <img src={thumbnailUrl} alt={user.name} />
            }
          </picture>
        </div>
        <div className="thumbnail-user__header">
          <h3 className="thumbnail-user__name">{user.name}</h3>
          <div className="thumbnail-user__location">
            <svg width={14} height={16} aria-hidden="true">
              <use xlinkHref="#icon-location" />
            </svg>
            <address className="thumbnail-user__location-address">
              {user.location}
            </address>
          </div>
        </div>
        <ul className="thumbnail-user__hashtags-list">
          {hashtagElements}
        </ul>
        <Link
          className="btn btn--medium thumbnail-user__button"
          to={`/${FrontendRoute.Users}/${user.id}`}
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
});
