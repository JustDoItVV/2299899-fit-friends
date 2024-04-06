import { memo } from 'react';
import { Link } from 'react-router-dom';

import {
    CatalogItem, fetchTrainingBackgroundPicture, useFetchFileUrl
} from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, Training } from '@2299899-fit-friends/types';

type CardTrainingThumbnailProps = {
  item: CatalogItem;
};

export default memo(function CardTrainingThumbnail(props: CardTrainingThumbnailProps): JSX.Element {
  const training = props.item as Training;
  const thumbnailUrl = useFetchFileUrl(training.id, fetchTrainingBackgroundPicture, 'img/content/placeholder.png');

  return (
    <div className="thumbnail-preview">
      <div className="thumbnail-preview__image">
        <picture>
          <img
            src={thumbnailUrl}
            width={452}
            height={191}
            alt={training.title}
          />
        </picture>
      </div>
      <div className="thumbnail-preview__inner">
        <h3 className="thumbnail-preview__title">{training.title}</h3>
        <div className="thumbnail-preview__button-wrapper">
          <Link
            className="btn btn--small thumbnail-preview__button"
            to={`/${FrontendRoute.Trainings}/${training.id}`}
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
});
