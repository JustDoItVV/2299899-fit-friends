import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useMemo, useRef } from 'react';

import {
    CaloriesTargetLimit, DEBOUNCE_THRESHOLD, PriceLimit, RatingLimit
} from '@2299899-fit-friends/consts';
import { redirectToRoute, useAppDispatch } from '@2299899-fit-friends/frontend-core';
import { isEmptyObject } from '@2299899-fit-friends/helpers';
import {
    FrontendRoute, QueryPagination, SortDirection, TrainingDuration, TrainingType
} from '@2299899-fit-friends/types';

import MultiRangeSlider, {
    MultiRangeSliderHandles
} from '../../multi-range-slider/multi-range-slider';

type FormFilterSortCatalogProps = {
  classNamePrefix: string;
  filters: Record<string, boolean>;
  sorters: Record<string, boolean>;
  setQueryParams: React.Dispatch<React.SetStateAction<QueryPagination>>;
  title?: string;
  buttonBackPath?: string;
  debounceTreshold?: number;
};

export default function FormFilterSortCatalog(props: FormFilterSortCatalogProps): JSX.Element {
  const { classNamePrefix, title, filters, sorters, setQueryParams } = props;
  const backButtonPath = props.buttonBackPath ?? `/${FrontendRoute.Main}`;
  const debounceTreshold = props.debounceTreshold ?? DEBOUNCE_THRESHOLD;

  const dispatch = useAppDispatch();
  const priceMinInputRef = useRef<HTMLInputElement | null>(null);
  const priceMaxInputRef = useRef<HTMLInputElement | null>(null);
  const sliderPriceRef = useRef<MultiRangeSliderHandles | null>(null);
  const caloriesMinInputRef = useRef<HTMLInputElement | null>(null);
  const caloriesMaxInputRef = useRef<HTMLInputElement | null>(null);
  const sliderCaloriesRef = useRef<MultiRangeSliderHandles | null>(null);
  const typeRef = useRef<string[]>([]);
  const durationRef = useRef<string[]>([]);
  const sortPriceRef = useRef<SortDirection>(SortDirection.Asc);

  const debouncedSetQueryParams = useMemo(() =>
    debounce((value: string[] | string | null, param: string) => {
      setQueryParams((oldData) => {
        const newData = { ...oldData };
        if (!value) {
          delete newData[param];
        } else {
          newData[param] = value;
          newData.page = 1;
        }
        return newData;
      });
    }, debounceTreshold),
    [setQueryParams, debounceTreshold]
  );

  const handleBackButtonClick = () => {
    dispatch(redirectToRoute(backButtonPath));
  };

  const handlePriceMinInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const slider = sliderPriceRef.current;
    const target = evt.currentTarget;
    if (slider) {
      slider.setMinValue(target.valueAsNumber || PriceLimit.Min);
    }
    debouncedSetQueryParams(target.value ? target.value : null, 'priceMin');
  };

  const handlePriceMinChange = useCallback((value: number) => {
    if (priceMinInputRef.current) {
      priceMinInputRef.current.value = value.toString();
    }
    debouncedSetQueryParams(value.toString(), 'priceMin');
  }, [debouncedSetQueryParams]);

  const handlePriceMaxInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const slider = sliderPriceRef.current;
    const target = evt.currentTarget;
    if (slider) {
      slider.setMaxValue(target.valueAsNumber || PriceLimit.MockMax);
    }
    debouncedSetQueryParams(target.value ? target.value : null, 'priceMax');
  };

  const handlePriceMaxChange = useCallback((value: number) => {
    if (priceMaxInputRef.current) {
      priceMaxInputRef.current.value = value.toString();
    }
    debouncedSetQueryParams(value.toString(), 'priceMax');
  }, [debouncedSetQueryParams]);

  const handleCaloriesMinInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const slider = sliderCaloriesRef.current;
    const target = evt.currentTarget;
    if (slider) {
      slider.setMinValue(target.valueAsNumber || CaloriesTargetLimit.Min);
    }
    debouncedSetQueryParams(target.value ? target.value : null, 'caloriesMin');
  };

  const handleCaloriesMinChange = useCallback((value: number) => {
    if (caloriesMinInputRef.current) {
      caloriesMinInputRef.current.value = value.toString();
    }
    debouncedSetQueryParams(value.toString(), 'caloriesMin');
  }, [debouncedSetQueryParams]);

  const handleCaloriesMaxInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const slider = sliderCaloriesRef.current;
    const target = evt.currentTarget;
    if (slider) {
      slider.setMaxValue(target.valueAsNumber || CaloriesTargetLimit.Max);
    }
    debouncedSetQueryParams(target.value ? target.value : null, 'caloriesMax');
  };

  const handleCaloriesMaxChange = useCallback((value: number) => {
    if (caloriesMaxInputRef.current) {
      caloriesMaxInputRef.current.value = value.toString();
    }
    debouncedSetQueryParams(value.toString(), 'caloriesMax');
  }, [debouncedSetQueryParams]);

  const handleRatingMinChange = useCallback((value: number) => {
    debouncedSetQueryParams(value.toString(), 'ratingMin');
  }, [debouncedSetQueryParams]);

  const handleRatingMaxChange = useCallback((value: number) => {
    debouncedSetQueryParams(value.toString(), 'ratingMax');
  }, [debouncedSetQueryParams]);

  const handleTypeInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.value;
    const index = typeRef.current.indexOf(value);

    if (evt.currentTarget.checked) {
      typeRef.current.push(value);
    } else if (index !== -1) {
      typeRef.current.splice(index, 1);
    }

    debouncedSetQueryParams(typeRef.current, 'type');
  };

  const handleDurationInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.value;
    const index = durationRef.current.indexOf(value);

    if (evt.currentTarget.checked) {
      durationRef.current.push(value);
    } else if (index !== -1) {
      durationRef.current.splice(index, 1);
    }

    debouncedSetQueryParams(durationRef.current, 'duration');
  };

  const handleSortPriceChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.value;

    if (value === 'free') {
      sortPriceRef.current = SortDirection.Asc;
      debouncedSetQueryParams(PriceLimit.Min.toString(), 'priceMin');
    } else if (value === SortDirection.Asc) {
      sortPriceRef.current = value;
      debouncedSetQueryParams((PriceLimit.Min + 1).toString(), 'priceMin');
    } else {
      sortPriceRef.current = value as SortDirection;
    }

    debouncedSetQueryParams(sortPriceRef.current, 'sortDirection');
  };

  const durationFilterElements = Object.values(TrainingDuration).map((duration, index) => (
    <li className={`${classNamePrefix}-form__check-list-item`} key={`duration_filter_${index}`}>
      <div className="custom-toggle custom-toggle--checkbox">
        <label>
          <input
            type="checkbox"
            value={duration}
            name="duration"
            onChange={handleDurationInputChange}
          />
          <span className="custom-toggle__icon">
            <svg width={9} height={6} aria-hidden="true">
              <use xlinkHref="#arrow-check" />
            </svg>
          </span>
          <span className="custom-toggle__label">
            {duration}
          </span>
        </label>
      </div>
    </li>
  ));

  const typeFilterElements = Object.values(TrainingType).map((type, index) => (
    <li className={`${classNamePrefix}__check-list-item`} key={`type_filter_${index}`}>
      <div className="custom-toggle custom-toggle--checkbox">
        <label>
          <input
            type="checkbox"
            value={type}
            name="type"
            onChange={handleTypeInputChange}
          />
          <span className="custom-toggle__icon">
            <svg width={9} height={6} aria-hidden="true">
              <use xlinkHref="#arrow-check" />
            </svg>
          </span>
          <span className="custom-toggle__label">
            {type}
          </span>
        </label>
      </div>
    </li>
  ));

  return (
    <div className={`${classNamePrefix}-form`}>
      {
        title &&
        <h2 className="visually-hidden">{title} Фильтр</h2>
      }
        <div className={`${classNamePrefix}-form__wrapper`}>
        <button
          className={`btn-flat btn-flat--underlined ${classNamePrefix}-form__btnback`}
          type="button"
          onClick={handleBackButtonClick}
        >
          <svg width={14} height={10} aria-hidden="true">
            <use xlinkHref="#arrow-left" />
          </svg>
          <span>Назад</span>
        </button>
        {
          !isEmptyObject(filters) &&
          <h3 className={`${classNamePrefix}-form__title`}>фильтры</h3>
        }
        <form className={`${classNamePrefix}-form__form`}>
          {
            Object.prototype.hasOwnProperty.call(filters, 'price') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--price`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>Цена, ₽</h4>
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
          }
          {
            Object.prototype.hasOwnProperty.call(filters, 'calories') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--calories`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>Калории</h4>
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
          }
          {
            Object.prototype.hasOwnProperty.call(filters, 'rating') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--raiting`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>Рейтинг</h4>
              <div className="filter-raiting">
                <MultiRangeSlider
                  min={0}
                  max={RatingLimit.Max}
                  onChangeMin={handleRatingMinChange}
                  onChangeMax={handleRatingMaxChange}
                />
              </div>
            </div>
          }
          {
            Object.prototype.hasOwnProperty.call(filters, 'type') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--type`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>
                Тип
              </h4>
              <ul className={`${classNamePrefix}-form__check-list`}>
                {typeFilterElements}
              </ul>
            </div>
          }
          {
            Object.prototype.hasOwnProperty.call(filters, 'duration') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--duration`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>
                Длительность
              </h4>
              <ul className={`${classNamePrefix}-form__check-list`}>
                {durationFilterElements}
              </ul>
            </div>
          }
          {
            !isEmptyObject(sorters) &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--sort`}>
              <h4 className={`${classNamePrefix}-form__title ${classNamePrefix}-form__title--sort`}>
                Сортировка
              </h4>
              {
                Object.prototype.hasOwnProperty.call(sorters, 'price') &&
                <div className={`btn-radio-sort ${classNamePrefix}-form__radio`}>
                  <label>
                    <input type="radio" name="sort" value={SortDirection.Asc} onChange={handleSortPriceChange} defaultChecked />
                    <span className="btn-radio-sort__label">Дешевле</span>
                  </label>
                  <label>
                    <input type="radio" name="sort" value={SortDirection.Desc} onChange={handleSortPriceChange} />
                    <span className="btn-radio-sort__label">Дороже</span>
                  </label>
                  <label>
                    <input type="radio" name="sort" value='free' onChange={handleSortPriceChange} />
                    <span className="btn-radio-sort__label">Бесплатные</span>
                  </label>
                </div>
              }
            </div>
          }
        </form>
      </div>
    </div>
  );
}
