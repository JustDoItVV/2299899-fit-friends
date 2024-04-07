import { memo } from 'react';
import { Link } from 'react-router-dom';

import { CatalogItem, fetchUserAvatar, useFetchFileUrl } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, User } from '@2299899-fit-friends/types';

type CardSeekCompanyProps = {
  item: CatalogItem;
};

export default memo(function CardLookCompany({ item }: CardSeekCompanyProps): JSX.Element {
  const user = item as User;
  const thumbnailUrl = useFetchFileUrl(user.id, fetchUserAvatar, 'img/content/placeholder.png');

  const hashtagsElements = user.trainingType.map((type, index) => (
    <li className="thumbnail-user__hashtags-item" key={`seek-company-hashtag_${user.id}_${index}`}>
      <div className="hashtag thumbnail-user__hashtag">
        <span>#{type}</span>
      </div>
    </li>
  ));

  return (
    <div className="look-for-company__item">
      <div className="thumbnail-user thumbnail-user--role-user thumbnail-user--dark">
        <div className="thumbnail-user__image">
          <picture>
            <img
              src={thumbnailUrl}
              width={82}
              height={82}
              alt={user.name}
            />
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
          {hashtagsElements}
        </ul>
        <Link
          className="btn btn--outlined btn--dark-bg btn--medium thumbnail-user__button"
          to={`/${FrontendRoute.Users}/${user.id}`}
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
});
