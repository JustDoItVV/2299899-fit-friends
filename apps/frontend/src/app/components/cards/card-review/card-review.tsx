import './card-review.css';

import { memo, useEffect, useState } from 'react';

import {
    CatalogItem, fetchUserAction, fetchUserAvatar, useAppDispatch, useFetchFileUrl
} from '@2299899-fit-friends/frontend-core';
import { Review, User } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';

type CardReviewProps = {
  item: CatalogItem;
};

export default memo(function CardReview({ item }: CardReviewProps): JSX.Element {
  const review = item as Review;
  const dispatch = useAppDispatch();
  const avatarUrl = useFetchFileUrl(fetchUserAvatar, { id: review.userId }, 'img/content/placeholder.png');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = unwrapResult(await dispatch(fetchUserAction(review.userId)));
      setUser(data);
    };

    fetch();
  }, [dispatch, review]);

  return (
    <div className="review">
      <div className="review__user-info">
        <div className="review__user-photo">
          <picture>
            <img
              src={avatarUrl}
              width={64}
              height={64}
              alt={`user_${review.userId}`}
            />
          </picture>
        </div>
        <span className="review__user-name">{user?.name}</span>
        <div className="review__rating">
          <svg width={16} height={16} aria-hidden="true">
            <use xlinkHref="#icon-star" />
          </svg>
          <span>{review.rating}</span>
        </div>
      </div>
      <p className="review__comment">
        {review.text}
      </p>
    </div>
  );
});
