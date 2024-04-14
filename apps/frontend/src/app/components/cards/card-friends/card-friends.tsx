import './card-friends.css';

import classnames from 'classnames';
import { memo, MouseEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { PlaceholderPath } from '@2299899-fit-friends/consts';
import {
    CatalogItem, createRequest, fetchUserAvatar, selectCurrentUser, updateRequest, useAppDispatch,
    useAppSelector, useFetchFileUrl
} from '@2299899-fit-friends/frontend-core';
import {
    FrontendRoute, TrainingRequest, TrainingRequestStatus, User, UserRole
} from '@2299899-fit-friends/types';

import Loading from '../../loading/loading';

type FriendsCatalogCardProps = {
  item: CatalogItem;
  additionalData?: { requests?: TrainingRequest[] },
};

export default memo(function FriendsCatalogCard({ item, additionalData }: FriendsCatalogCardProps): JSX.Element {
  const user = item as User;
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const [request, setRequest] = useState<TrainingRequest | null>(null);
  const { fileUrl: thumbnailUrl, loading } = useFetchFileUrl(
    fetchUserAvatar,
    { id: user.id },
    PlaceholderPath.Image,
    [user],
  );

  useEffect(() => {
    const requestFound = additionalData?.requests?.find((request) =>
      (request.targetId === user.id && request.authorId === currentUser?.id) ||
      (request.authorId === user.id && request.targetId === currentUser?.id)
    );
    if (requestFound) {
      setRequest(requestFound);
    }
  }, [additionalData, user, currentUser]);

  const handleAcceptButtonClick = () => {
    if (request?.id) {
      dispatch(updateRequest({ id: request.id, status: TrainingRequestStatus.Accepted }));
      setRequest((old) => {
        const newValue = { ...old } as TrainingRequest;
        newValue.status = TrainingRequestStatus.Accepted;
        return newValue;
      });
    }
  };

  const handleRejectButtonClick = () => {
    if (request?.id) {
      dispatch(updateRequest({ id: request.id, status: TrainingRequestStatus.Rejected }));
      setRequest((old) => {
        const newValue = { ...old } as TrainingRequest;
        newValue.status = TrainingRequestStatus.Rejected;
        return newValue;
      });
    }
  };

  const handleInviteToTrainingButtonClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (user?.id) {
      evt.currentTarget.disabled = true;
      dispatch(createRequest(user?.id));
      setRequest((old) => {
        const newValue = { ...old } as TrainingRequest;
        newValue.status = TrainingRequestStatus.Consideration;
        return newValue;
      });
    }
  };

  const hashtagElements = user.trainingType.map((type, index) => (
    <li key={`${user.id}_hashtag_${index}`}>
      <div className="hashtag thumbnail-friend__hashtag">
        <span>#{type}</span>
      </div>
    </li>
  ));

  return (
    <div className="friends-list__item">
      <div className="thumbnail-friend">
        <Link to={`/${FrontendRoute.Users}/${user.id}`}>
          <div className={classnames(
            'thumbnail-friend__info',
            {
              'thumbnail-friend__info--theme-light': user.role === UserRole.User,
              'thumbnail-friend__info--theme-dark': user.role === UserRole.Trainer,
            },
          )}>
            <div className="thumbnail-friend__image-status">
              <div className="thumbnail-friend__image">
                <picture>
                  {
                    loading
                    ?
                    <Loading />
                    :
                    <img
                      src={thumbnailUrl}
                      width={78}
                      height={78}
                      alt={user.name}
                    />
                  }
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
              <div className={classnames(
                'thumbnail-friend__ready-status',
                {
                  'thumbnail-friend__ready-status--is-ready':
                  (user.isReadyToTraining && user.role === UserRole.User) ||
                  (user.isReadyToPersonal && user.role === UserRole.Trainer),
                  'thumbnail-friend__ready-status--is-not-ready':
                    (!user.isReadyToTraining && user.role === UserRole.User) ||
                    (!user.isReadyToPersonal && user.role === UserRole.Trainer),
                }
              )}>
                <span>{user.isReadyToTraining ? 'Г' : 'Не г'}отов к&nbsp;тренировке</span>
              </div>
              {
                user.role === UserRole.User && user.isReadyToTraining &&
                <button
                  className='thumbnail-friend__invite-button'
                  type='button'
                  onClick={handleInviteToTrainingButtonClick}
                  disabled={request?.status === TrainingRequestStatus.Consideration}
                >
                  <svg width="43" height="46" aria-hidden={true} focusable={false}>
                    <use xlinkHref='#icon-invite'></use>
                  </svg>
                </button>
              }
            </div>
          </div>
        </Link>
        {
          request &&
          <div className={classnames(
            'thumbnail-friend__request-status',
            {
              'thumbnail-friend__request-status--role-user': user.role === UserRole.User,
              'thumbnail-friend__request-status--role-coach': user.role === UserRole.Trainer,
            }
          )}>
            <p className="thumbnail-friend__request-text">
              Запрос на&nbsp;
              {user.role === UserRole.User ? 'совместную' : 'персональную'}
              &nbsp;тренировку&nbsp;
              {classnames({
                'отправлен': currentUser?.id === request.authorId && request.status === TrainingRequestStatus.Consideration,
                'принят': request.status === TrainingRequestStatus.Accepted,
                'отклонён': request.status === TrainingRequestStatus.Rejected,
              })}
            </p>
            {
              currentUser?.id !== request.authorId &&
              request.status === TrainingRequestStatus.Consideration &&
              <div className="thumbnail-friend__button-wrapper">
                <button
                  className="btn btn--medium btn--dark-bg thumbnail-friend__button"
                  type="button"
                  onClick={handleAcceptButtonClick}
                >
                  Принять
                </button>
                <button
                  className="btn btn--medium btn--outlined btn--dark-bg thumbnail-friend__button"
                  type="button"
                  onClick={handleRejectButtonClick}
                >
                  Отклонить
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  );
});
