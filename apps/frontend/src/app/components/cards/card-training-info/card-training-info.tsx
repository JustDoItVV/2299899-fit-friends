import './card-training-info.css';

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';

import {
    DISCOUNT, PlaceholderPath, TrainingVideoAllowedExtensions
} from '@2299899-fit-friends/consts';
import {
    fetchTrainingBackgroundPicture, fetchTrainingVideo, fetchUser, fetchUserAvatar, selectBalance,
    selectCurrentUser, selectResponseError, selectTraining, updateBalance, updateTraining,
    useAppDispatch, useAppSelector, useFetchFileUrl
} from '@2299899-fit-friends/frontend-core';
import { getResponseErrorMessage } from '@2299899-fit-friends/helpers';
import { User, UserRole } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';

import Loading from '../../loading/loading';
import PopupBuy from '../../popups/popup-buy/popup-buy';

type CardTrainingInfoProps = {
  id: string | undefined;
};

export default function CardTrainingInfo({ id }: CardTrainingInfoProps): JSX.Element {
  const dispatch = useAppDispatch();
  const training = useAppSelector(selectTraining);
  const balance = useAppSelector(selectBalance);
  const responseError = useAppSelector(selectResponseError);
  const currentUser = useAppSelector(selectCurrentUser);

  const [isTrainingActive, setIsTrainingActive] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [trainer, setTrainer] = useState<User | null>(null);
  const [isVideoUpdating, setIsVideoUpdating] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>(`Загрузите сюда файлы формата ${
    Object.keys(TrainingVideoAllowedExtensions).map(((extention) => extention.toLocaleUpperCase())).join(', ')
  }`);

  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<string | null>(null);
  const descriptionRef = useRef<string | null>(null);
  const priceRef = useRef<string | null>(null);
  const playerRef = useRef<ReactPlayer | null>(null);

  const { fileUrl: avatarUrl, loading: avatarLoading } = useFetchFileUrl(
    fetchUserAvatar,
    { id: training?.userId },
    PlaceholderPath.Image,
    [trainer],
  );
  const { fileUrl: videoUrl } = useFetchFileUrl(
    fetchTrainingVideo,
    { id: training?.id },
    PlaceholderPath.Image,
    [training],
  );
  const { fileUrl: videoPreviewUrl, loading: videoPreviewLoading } = useFetchFileUrl(
    fetchTrainingBackgroundPicture,
    { id: training?.id },
    PlaceholderPath.Image,
    [training],
  );

  useEffect(() => {
    const fetch = async () => {
      if (training?.userId) {
        const data = unwrapResult(
          await dispatch(fetchUser(training?.userId))
        );
        setTrainer(data);
      }
    };

    fetch();
  }, [dispatch, training]);

  useEffect(() => {
    if (responseError) {
      setIsEditing(true);
    } else {
      titleRef.current = null;
      descriptionRef.current = null;
      priceRef.current = null;
    }
  }, [responseError])

  const handleStartTrainingButtonClick = () => {
    if (training?.id) {
      dispatch(updateBalance({ trainingId: training.id, available: balance.available - 1 }));
      setIsTrainingActive(true);
    }
  };

  const handleStopTrainingButtonClick = () => {
    setIsTrainingActive(false);
    playerRef.current?.showPreview();
  };

  const handleEditButtonClick = () => {
    if (isEditing) {
      setIsEditing(false);
      setIsVideoUpdating(false);
      if (id) {
        const formData = new FormData();
        if (titleRef.current) {
          formData.append('title', titleRef.current);
        }
        if (descriptionRef.current) {
          formData.append('description', descriptionRef.current);
        }
        if (priceRef.current) {
          formData.append('price', priceRef.current);
        }
        if (videoInputRef.current?.files && videoInputRef.current.files.length > 0) {
          formData.append('video', videoInputRef.current.files[0]);
        }
        dispatch(updateTraining({ id, data: formData }));
      }
    } else {
      setIsEditing(true);
      setIsVideoUpdating(true);
    }
  };

  const handleDiscountButtonClick = () => {
    if (id && training) {
      const formData = new FormData();
      formData.append('isSpecialOffer', training?.isSpecialOffer ? '' : 'true');
      dispatch(updateTraining({ id, data: formData }))
    }
  };

  const handleTitleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget) {
      titleRef.current = evt.currentTarget.value;
    }
  };

  const handleDescriptionInputChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    if (evt.currentTarget) {
      descriptionRef.current = evt.currentTarget.value;
    }
  };

  const handlePriceInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget) {
      priceRef.current = evt.currentTarget.value;
    }
  };

  const handleDeleteVideoButtonClick = () => {
    setIsVideoUpdating((old) => !old);
  };

  const handleVideoInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget?.files && evt.currentTarget.files.length > 0) {
      setFilename(evt.currentTarget.files[0].name);
    }
  };

  const handleVideoPreviewClick = (evt: MouseEvent<HTMLDivElement>) => {
    if (!balance || !balance.available) {
      evt.preventDefault();
      playerRef.current?.showPreview();
    }
  };

  const videoPreviewElement = (
    videoPreviewLoading
    ?
    <Loading />
    :
    <picture className='video-preview-element'>
      <img src={videoPreviewUrl} alt='videoPreview'/>
      <button
        className="training-video__play-button btn-reset"
        disabled={!isTrainingActive}
      >
        <svg width={18} height={30} aria-hidden="true">
          <use xlinkHref="#icon-arrow" />
        </svg>
      </button>
    </picture>
  );

  return (
    <div className="training-card">
      <div className="training-info">
        <h2 className="visually-hidden">Информация о тренировке</h2>
        <div className="training-info__header">
          <div className="training-info__coach">
            <div className="training-info__photo">
              <picture>
                {
                  avatarLoading
                  ?
                  <Loading />
                  :
                  <img
                    src={avatarUrl}
                    width={64}
                    height={64}
                    alt={trainer?.name}
                  />
                }
              </picture>
            </div>
            <div className="training-info__coach-info">
              <span className="training-info__label">Тренер</span>
              <span className="training-info__name">{trainer?.name}</span>
            </div>
          </div>
          {
            currentUser?.id === trainer?.id &&
            <button
              className='btn-flat btn-flat--light btn-flat--underlined training-info__edit'
              onClick={handleEditButtonClick}
            >
              <svg width='12' height='12' aria-hidden={true}>
                <use xlinkHref='#icon-edit'/>
              </svg>
              <span>{isEditing ? 'Сохранить' : 'Редактировать'}</span>
            </button>
          }
        </div>
        <div className="training-info__main-content">
          <form>
            <div className="training-info__form-wrapper">
              <div className="training-info__info-wrapper">
                <div className="training-info__input training-info__input--training">
                  <label>
                    <span className="training-info__label">
                      Название тренировки
                    </span>
                    <input
                      type="text"
                      name="training"
                      defaultValue={training?.title}
                      disabled={currentUser?.role === UserRole.User || !isEditing}
                      onChange={handleTitleInputChange}
                    />
                  </label>
                  <div className="training-info__error">Обязательное поле</div>
                </div>
                <div className="training-info__textarea">
                  <label>
                    <span className="training-info__label">
                      Описание тренировки
                    </span>
                    <textarea
                      name="description"
                      disabled={currentUser?.role === UserRole.User || !isEditing}
                      defaultValue={training?.description}
                      onChange={handleDescriptionInputChange}
                    />
                  </label>
                </div>
              </div>
              <div className="training-info__rating-wrapper">
                <div className="training-info__input training-info__input--rating">
                  <label>
                    <span className="training-info__label">Рейтинг</span>
                    <span className="training-info__rating-icon">
                      <svg width={18} height={18} aria-hidden="true">
                        <use xlinkHref="#icon-star" />
                      </svg>
                    </span>
                    <input
                      type="number"
                      name="rating"
                      value={
                        training?.rating && (training?.rating - Math.floor(training?.rating))
                        ? training?.rating.toFixed(1)
                        : training?.rating ?? 0
                      }
                      disabled
                    />
                  </label>
                </div>
                <ul className="training-info__list">
                  <li className="training-info__item">
                    <div className="hashtag hashtag--white">
                      <span>#{training?.type}</span>
                    </div>
                  </li>
                  <li className="training-info__item">
                    <div className="hashtag hashtag--white">
                      <span>#{training?.gender.split(' ').join('_')}</span>
                    </div>
                  </li>
                  <li className="training-info__item">
                    <div className="hashtag hashtag--white">
                      <span>#{training?.calories}ккал</span>
                    </div>
                  </li>
                  <li className="training-info__item">
                    <div className="hashtag hashtag--white">
                      <span>#{training?.duration.split(' ').join('_')}</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="training-info__price-wrapper">
                <div className="training-info__input training-info__input--price">
                  <label>
                    <span className="training-info__label">Стоимость</span>
                    <input
                      type="text"
                      name="price"
                      value={`${training?.price && training?.price * (1 - DISCOUNT * +!!training?.isSpecialOffer)} ₽`}
                      disabled={currentUser?.role === UserRole.User || !isEditing}
                      onChange={handlePriceInputChange}
                    />
                  </label>
                  <div className="training-info__error">Введите число</div>
                </div>
                {
                  currentUser?.id === trainer?.id &&
                  <button
                    className='btn-flat btn-flat--light btn-flat--underlined'
                    type='button'
                    onClick={handleDiscountButtonClick}
                  >
                    <svg width='14' height='14' aria-hidden={true}>
                      <use xlinkHref='#icon-discount'/>
                    </svg>
                    <span>{training?.isSpecialOffer ? 'Отменить скидку' : 'Сделать скидку 10%'}</span>
                  </button>
                }
                {
                  currentUser?.role === UserRole.User &&
                  <PopupBuy trainingId={id} trainingTitle={training?.title} trainingPrice={training?.price} trigger={
                    <button
                      className="btn training-info__buy"
                      type="button"
                      disabled={balance && !!balance.available}
                    >
                      Купить
                    </button>
                  } />
                }
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="training-video">
        <h2 className="training-video__title">Видео</h2>
        <div className="training-video__video">
          {
            !isVideoUpdating
            ?
            <div className="training-video__thumbnail">
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                controls={isTrainingActive}
                light={true}
                width='100%'
                height='100%'
                playIcon={videoPreviewElement}
                onEnded={handleStopTrainingButtonClick}
                onClickPreview={handleVideoPreviewClick}
              />
            </div>
            :
            <div className="drag-and-drop create-training__drag-and-drop">
              <label>
                <span className="drag-and-drop__label" tabIndex={0}>
                  {filename}
                  <svg width={20} height={20} aria-hidden="true">
                    <use xlinkHref="#icon-import-video" />
                  </svg>
                </span>
                <input
                  ref={videoInputRef}
                  type="file"
                  name="import"
                  tabIndex={-1}
                  accept={Object.keys(TrainingVideoAllowedExtensions).map(((extention) => `.${extention}`)).join(', ')}
                  onChange={handleVideoInputChange}
                />
                <span className="custom-input__error">
                  {getResponseErrorMessage(responseError, 'video')}
                </span>
              </label>
            </div>
          }
        </div>
        <div className="training-video__buttons-wrapper">
          {
            currentUser?.role === UserRole.User &&
            (
            isTrainingActive
            ?
            <button
              className="btn training-video__button training-video__button--stop"
              type="button"
              onClick={handleStopTrainingButtonClick}
            >
              Закончить
            </button>
            :
            <button
              className="btn training-video__button training-video__button--start"
              type="button"
              disabled={!balance || !balance.available}
              onClick={handleStartTrainingButtonClick}
            >
              Приступить
            </button>
            )
          }
          {
            currentUser?.id === training?.userId && isEditing &&
            <div className='training-video__edit-buttons'>
              {
                isVideoUpdating
                ?
                <button
                  className='btn'
                  type='button'
                  onClick={handleDeleteVideoButtonClick}
                >
                  Отменить
                </button>
                :
                <button
                  className='btn btn--outlined'
                  type='button'
                  onClick={handleDeleteVideoButtonClick}
                >
                  Удалить
                </button>
              }
            </div>
          }
        </div>
      </div>
    </div>
  );
}
