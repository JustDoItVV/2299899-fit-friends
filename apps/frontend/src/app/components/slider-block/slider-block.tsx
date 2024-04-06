import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

import { CardPlaceholderPreviewImage, SliderBlockItems } from '@2299899-fit-friends/consts';
import {
    CatalogItem, fetchTrainingsCatalog, useFetchPagination
} from '@2299899-fit-friends/frontend-core';
import { QueryPagination, Training } from '@2299899-fit-friends/types';

import CardPlaceholder from '../cards/card-placeholder/card-placeholder';

type SLiderBlockProps = {
  classNamePrefix: string;
  itemsPerPage?: number;
  itemsToScroll?: number;
  maxItems?: number;
  component: React.ComponentType<{ item: CatalogItem, key?: string }>;
  preload?: boolean;
  placeholderInfix?: string;
};

export default function SLiderBlock(props: SLiderBlockProps): JSX.Element {
  const { classNamePrefix, component: Card, maxItems } = props;
  const itemsPerPage = props.itemsPerPage ?? SliderBlockItems.DefaultPerPage;
  const itemsToScroll = props.itemsToScroll ?? SliderBlockItems.DefaultToSCroll;
  const preload = props.preload ?? false;
  const placeholderInfix = props.placeholderInfix ?? 'preview';

  const slickSliderRef = useRef<Slider | null>(null);
  const [queryParams,] = useState<QueryPagination>({ limit: 3 });
  const [itemsElements, setItemsElements] = useState<JSX.Element[]>([]);

  const { items, fetchNextPage, fetchAll } = useFetchPagination<Training>(fetchTrainingsCatalog, queryParams, maxItems);

  useEffect(() => {
    if (!preload) {
      fetchNextPage();
    }
  }, [fetchNextPage, preload]);

  useEffect(() => {
    if (preload) {
      fetchAll();
    }
  }, [fetchAll, preload]);

  useEffect(() => {
    const newElements = items.map((item) => (
      <li className={`${classNamePrefix}__item`} key={`${classNamePrefix}__item__${item.id}`}>
        <Card item={item} />
      </li>
    ));
    setItemsElements(newElements);
  }, [items, Card, classNamePrefix]);

  const handleLeftButtonClick = () => {
    slickSliderRef.current?.slickPrev();
  };

  const handleRightButtonClick = () => {
    slickSliderRef.current?.slickNext();
    console.log(items.length);
  };

  return (
    <section className={classNamePrefix}>
      <div className="container">
        <div className={`${classNamePrefix}__wrapper"`}>
          <div className={`${classNamePrefix}__title-wrapper"`}>
            <h2 className={`${classNamePrefix}__title`}>
              Специально подобрано для вас
            </h2>
            <div className={`${classNamePrefix}__controls`}>
              <button
                className={`btn-icon ${classNamePrefix}__control`}
                type="button"
                aria-label="previous"
                onClick={handleLeftButtonClick}
                disabled={items.length === 0}
              >
                <svg width={16} height={14} aria-hidden="true">
                  <use xlinkHref="#arrow-left" />
                </svg>
              </button>
              <button
                className={`btn-icon ${classNamePrefix}__control`}
                type="button"
                aria-label="next"
                onClick={handleRightButtonClick}
                disabled={items.length === 0}
              >
                <svg width={16} height={14} aria-hidden="true">
                  <use xlinkHref="#arrow-right" />
                </svg>
              </button>
            </div>
          </div>
            {
              items.length !== 0
              ?
              <Slider
                ref={slickSliderRef}
                className={`${classNamePrefix}__list`}
                slidesToShow={itemsPerPage}
                slidesToScroll={itemsToScroll}
                arrows={false}
                infinite={false}
              >
                {itemsElements}
              </Slider>
              :
              <ul className={`${classNamePrefix}__list`}>
                <li className={`${classNamePrefix}__item`}>
                  <CardPlaceholder classNameInfix={placeholderInfix} imagePath={CardPlaceholderPreviewImage.ForYou} />
                </li>
              </ul>
            }
        </div>
      </div>
    </section>
  );
}
