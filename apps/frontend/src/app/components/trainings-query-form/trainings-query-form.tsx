import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useMemo, useRef } from 'react';

import {
    CaloriesTargetLimit, DEBOUNCE_THRESHOLD, PriceLimit, RatingLimit
} from '@2299899-fit-friends/consts';
import { redirectToRoute, useAppDispatch } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, QueryPagination, TrainingDuration } from '@2299899-fit-friends/types';

import MultiRangeSlider, {
    MultiRangeSliderHandles
} from '../multi-range-slider/multi-range-slider';

type TrainingsQueryFormProps = {

};

export default function TrainingsQueryForm({ setQueryParams }: TrainingsQueryFormProps): JSX.Element {
  const dispatch = useAppDispatch();
  const priceMinInputRef = useRef<HTMLInputElement | null>(null);
  const priceMaxInputRef = useRef<HTMLInputElement | null>(null);
  const sliderPriceRef = useRef<MultiRangeSliderHandles | null>(null);
  const caloriesMinInputRef = useRef<HTMLInputElement | null>(null);
  const caloriesMaxInputRef = useRef<HTMLInputElement | null>(null);
  const sliderCaloriesRef = useRef<MultiRangeSliderHandles | null>(null);




  const handleBackButtonClick = () => {
    dispatch(redirectToRoute(`/${FrontendRoute.Account}`));
  };









  return (
    <div className="my-training-form">
      <h2 className="visually-hidden">Мои тренировки Фильтр</h2>
      <div className="my-training-form__wrapper">
        <button
          className="btn-flat btn-flat--underlined my-training-form__btnback"
          type="button"
          onClick={handleBackButtonClick}
        >
          <svg width={14} height={10} aria-hidden="true">
            <use xlinkHref="#arrow-left" />
          </svg>
          <span>Назад</span>
        </button>
        <h3 className="my-training-form__title">фильтры</h3>
        <form className="my-training-form__form">
          <div className="my-training-form__block my-training-form__block--price">
            <h4 className="my-training-form__block-title">Цена, ₽</h4>
            <div className="filter-price">
              <div className="filter-price__input-text filter-price__input-text--min">
                <input
                  ref={priceMinInputRef}
                  type="number"
                  id="text-min"
                  name="text-min"
                  onChange={handlePriceMinInputChange}
                />
                <label htmlFor="text-min">от</label>
              </div>
              <div className="filter-price__input-text filter-price__input-text--max">
                <input
                  ref={priceMaxInputRef}
                  type="number"
                  id="text-max"
                  name="text-max"
                  onChange={handlePriceMaxInputChange}
                />
                <label htmlFor="text-max">до</label>
              </div>
            </div>
            <div className="filter-range">
              <MultiRangeSlider
                ref={sliderPriceRef}
                min={PriceLimit.Min}
                max={PriceLimit.MockMax}
                onChangeMin={handlePriceMinChange}
                onChangeMax={handlePriceMaxChange}
                labels={false}
              />
            </div>
          </div>
          <div className="my-training-form__block my-training-form__block--calories">
            <h4 className="my-training-form__block-title">Калории</h4>
            <div className="filter-calories">
              <div className="filter-calories__input-text filter-calories__input-text--min">
                <input
                  ref={caloriesMinInputRef}
                  type="number"
                  id="text-min-cal"
                  name="text-min-cal"
                  onChange={handleCaloriesMinInputChange}
                />
                <label htmlFor="text-min-cal">от</label>
              </div>
              <div className="filter-calories__input-text filter-calories__input-text--max">
                <input
                  ref={caloriesMaxInputRef}
                  type="number"
                  id="text-max-cal"
                  name="text-max-cal"
                  onChange={handleCaloriesMaxInputChange}
                />
                <label htmlFor="text-max-cal">до</label>
              </div>
            </div>
            <div className="filter-range">
              <MultiRangeSlider
                ref={sliderCaloriesRef}
                min={CaloriesTargetLimit.Min}
                max={CaloriesTargetLimit.Max}
                onChangeMin={handleCaloriesMinChange}
                onChangeMax={handleCaloriesMaxChange}
                labels={false}
              />
            </div>
          </div>
          <div className="my-training-form__block my-training-form__block--raiting">
            <h4 className="my-training-form__block-title">Рейтинг</h4>
            <div className="filter-raiting">
              <MultiRangeSlider
                min={0}
                max={RatingLimit.Max}
                onChangeMin={handleRatingMinChange}
                onChangeMax={handleRatingMaxChange}
              />
            </div>
          </div>
          <div className="my-training-form__block my-training-form__block--duration">
            <h4 className="my-training-form__block-title">
              Длительность
            </h4>
            <ul className="my-training-form__check-list">
              {durationFilerElements}
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
