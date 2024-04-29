import './slider-block.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import classnames from 'classnames';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

import { PlaceholderPath, SliderBlockItems } from '@2299899-fit-friends/consts';
import { CatalogItem, useFetchPagination } from '@2299899-fit-friends/frontend-core';
import { Pagination, QueryPagination } from '@2299899-fit-friends/types';
import { AsyncThunk } from '@reduxjs/toolkit';

import CardPlaceholder from '../cards/card-placeholder/card-placeholder';
import Loading from '../loading/loading';

type SliderBlockProps = {
  fetch: AsyncThunk<Pagination<CatalogItem>, QueryPagination, Record<string, unknown>>,
  component: React.ComponentType<{
    item: CatalogItem,
    index?: number,
    key?: string
  }>;
  query: QueryPagination;
  title?: string;
  showTitle?: boolean;
  classNamePrefix?: string;
  headerAdditionalElement?: JSX.Element;
  itemsPerPage?: number;
  itemsToScroll?: number;
  maxItems?: number;
  preload?: boolean;
  placeholderInfix?: string;
  outlinedButtons?: boolean;
  controls?: boolean;
  dots?: boolean;
  autoplay?: boolean;
  children?: JSX.Element | JSX.Element[];
};

export default function SliderBlock(props: SliderBlockProps): JSX.Element {
  const { fetch, component: Card, title, maxItems, headerAdditionalElement, children } = props;
  const classNamePrefix = props.classNamePrefix ?? '';
  const itemsPerPage = props.itemsPerPage ?? SliderBlockItems.DefaultPerPage;
  const itemsToScroll = props.itemsToScroll ?? SliderBlockItems.DefaultToScroll;
  const preload = props.preload ?? false;
  const placeholderInfix = props.placeholderInfix ?? 'preview';
  const outlinedButtons = props.outlinedButtons ?? false;
  const controls = props.controls ?? true;
  const dots = props.dots ?? true;
  const showTitle = props.showTitle ?? true;
  const autoplay = props.autoplay ?? false;
  const query = props.query ?? {};

  const [currentItem, setCurrentItem] = useState<number>(0);
  const [itemsElements, setItemsElements] = useState<JSX.Element[]>([]);

  const slickSliderRef = useRef<Slider | null>(null);

  const { items, fetchNextPage, fetchAll, loading } = useFetchPagination<CatalogItem>(fetch, query, maxItems);

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

  useEffect(() => {
    slickSliderRef.current?.slickGoTo(0);
  }, [itemsElements]);

  const handleLeftButtonClick = () => {
    slickSliderRef.current?.slickPrev();
    if (currentItem > 0) {
      setCurrentItem(currentItem - 1);
    }
  };

  const handleRightButtonClick = () => {
    if (currentItem < items.length - 1) {
      setCurrentItem(currentItem + 1);
      slickSliderRef.current?.slickNext();
    }
  };

  const handleDotClick = (evt: MouseEvent<HTMLButtonElement>) => {
    const value = parseInt(evt.currentTarget.value, 10);
    setCurrentItem(value);
    slickSliderRef.current?.slickGoTo(value);
  };

  const dotsElements = items.map((_, index) => (
    <button
      key={`${classNamePrefix}_dot_${index}`}
      className={`${classNamePrefix}__slider-dot ${index === currentItem ? `${classNamePrefix}__slider-dot--active` : ''}`}
      value={index}
      onClick={handleDotClick}
    />
  ));

  return (
    <div className={`${classNamePrefix}__wrapper`} data-testid={`slider-block-${classNamePrefix}`}>
      <div className={`${classNamePrefix}__title-wrapper`}>
        {
          title &&
          <h2 className={classnames(
            `${classNamePrefix}__title`,
            { 'visually-hidden': !showTitle }
          )}>
            {title}
          </h2>
        }
        { headerAdditionalElement }
        {
          controls &&
          <div className={`${classNamePrefix}__controls`} data-testid='slider-block-controls'>
            <button
              className={classnames(
                'btn-icon',
                { 'btn-icon--outlined': outlinedButtons },
                `${classNamePrefix}__control`,
              )}
              type="button"
              aria-label="previous"
              onClick={handleLeftButtonClick}
              disabled={items.length === 0 || currentItem === 0}
            >
              <svg width={16} height={14} aria-hidden="true">
                <use xlinkHref="#arrow-left" />
              </svg>
            </button>
            <button
              className={classnames(
                'btn-icon',
                { 'btn-icon--outlined': outlinedButtons },
                `${classNamePrefix}__control`,
              )}
              type="button"
              aria-label="next"
              onClick={handleRightButtonClick}
              disabled={items.length === 0 || currentItem >= items.length - itemsPerPage}
            >
              <svg width={16} height={14} aria-hidden="true">
                <use xlinkHref="#arrow-right" />
              </svg>
            </button>
          </div>
        }
      </div>
      {
        !loading
        ?
        <ul className={`${items.length !== 0 ? 'slider-block-wrapper' : ''} ${classNamePrefix}__list`} data-testid='slider-block-list'>
          {
            items.length !== 0
            ?
            <Slider
              ref={slickSliderRef}
              slidesToShow={itemsPerPage}
              slidesToScroll={itemsToScroll}
              arrows={false}
              variableWidth={true}
              adaptiveHeight={true}
              dots={false}
              autoplay={autoplay}
              infinite={autoplay}
              draggable={false}
            >
              {itemsElements}
            </Slider>
            :
            <li className={`${classNamePrefix}__item`} data-testid='slider-block-list-placeholder'>
              <CardPlaceholder classNameInfix={placeholderInfix} imagePath={PlaceholderPath.CardForYou} />
            </li>
          }
          {
            dots &&
            <div className={`${classNamePrefix}__slider-dots`} style={{ display: "flex" }}>
              {dotsElements}
            </div>
          }
        </ul>
        :
        <Loading />
      }
      { children }
    </div>
  );
}
